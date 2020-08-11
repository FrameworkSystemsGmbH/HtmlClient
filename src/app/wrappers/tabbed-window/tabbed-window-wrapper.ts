import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ITabbedLayoutControl } from 'app/layout/tabbed-layout/tabbed-layout-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { ControlType } from 'app/enums/control-type';
import { LayoutBase } from 'app/layout/layout-base';
import { TabbedLayout } from 'app/layout/tabbed-layout/tabbed-layout';
import { TabbedWindowComponent } from 'app/controls/tabbed-window/tabbed-window.component';
import { TabAlignment } from 'app/enums/tab-alignment';
import { TabPageTemplate } from 'app/wrappers/tabbed-window/tab-page-template';
import { TabPageWrapper } from 'app/wrappers/tabbed-window/tab-page-wrapper';
import { Visibility } from 'app/enums/visibility';
import { ClientEventType } from 'app/enums/client-event-type';
import { ClientSelectedTabPageChangeEvent } from 'app/common/events/client-selected-tab-page-change-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientSelectedTabPageChangedEvent } from 'app/common/events/client-selected-tab-page-changed-event';
import { FramesService } from 'app/services/frames.service';

export class TabbedWindowWrapper extends ContainerWrapper implements ITabbedLayoutControl {

  private tabPageTemplateActive: TabPageTemplate;
  private tabPageTemplateDisabled: TabPageTemplate;
  private tabPageTemplateInactive: TabPageTemplate;

  private selectedTabIndex: number;
  private selectedTabIndexOrg: number;

  private framesService: FramesService;

  private tabClickedSub: Subscription;

  protected init(): void {
    super.init();
    this.framesService = this.getInjector().get(FramesService);
  }

  public getControlType(): ControlType {
    return ControlType.TabbedWindow;
  }

  public getIsMobileMode(): boolean {
    return this.getPlatformService().isMobile();
  }

  public getSelectedTabIndex(): number {
    return this.selectedTabIndex;
  }

  public setSelectedTabIndex(selectedTabIndex: number): void {
    this.selectedTabIndex = selectedTabIndex;
  }

  public getTabPages(): Array<TabPageWrapper> {
    return this.getVchContainer().getChildren() as Array<TabPageWrapper>;
  }

  public getTabAlignment(): TabAlignment {
    const alignment: TabAlignment = this.getPropertyStore().getTabAlignment();
    return alignment != null ? alignment : TabAlignment.Top;
  }

  public getActiveImage(): string {
    return this.getPropertyStore().getActiveImage();
  }

  public getInactiveImage(): string {
    return this.getPropertyStore().getInactiveImage();
  }

  public isTabSelected(tabPage: TabPageWrapper): boolean {
    return this.getTabPages().indexOf(tabPage) === this.selectedTabIndex;
  }

  public getWidestLayoutTabPageHeader(): number {
    const visibleTabPages: Array<TabPageWrapper> = this.getTabPages().filter(t => t.getVisibility() === Visibility.Visible);

    let widestTabPageHeader: number = 0;

    for (const tabPage of visibleTabPages) {
      const tabPageTemplate: TabPageTemplate = this.getCurrentTabPageTemplate(tabPage);
      const captionWidth: number = this.getFontService().measureTextWidth(tabPage.getCaption(), tabPageTemplate.getFontFamily(), Number.zeroIfNull(tabPageTemplate.getFontSize()), tabPageTemplate.getFontBold(), tabPageTemplate.getFontItalic());
      const horizontalInsets: number =
        Number.zeroIfNull(tabPageTemplate.getBorderThicknessLeft()) +
        Number.zeroIfNull(tabPageTemplate.getPaddingLeft()) +
        Number.zeroIfNull(tabPageTemplate.getPaddingRight()) +
        Number.zeroIfNull(tabPageTemplate.getBorderThicknessRight());
      widestTabPageHeader = Math.max(widestTabPageHeader, captionWidth + horizontalInsets);
    }

    return Number.zeroIfNull(widestTabPageHeader);
  }

  public getHighestLayoutTabPageHeader(): number {
    const visibleTabPages: Array<TabPageWrapper> = this.getTabPages().filter(t => t.getVisibility() === Visibility.Visible);

    let highestTabPageHeader: number = 0;

    for (const tabPage of visibleTabPages) {
      const tabPageTemplate: TabPageTemplate = this.getCurrentTabPageTemplate(tabPage);
      const captionHeight: number = Number.zeroIfNull(tabPageTemplate.getLineHeight());
      const verticalInsets: number =
        Number.zeroIfNull(tabPageTemplate.getBorderThicknessTop()) +
        Number.zeroIfNull(tabPageTemplate.getPaddingTop()) +
        Number.zeroIfNull(tabPageTemplate.getPaddingBottom()) +
        Number.zeroIfNull(tabPageTemplate.getBorderThicknessBottom());
      highestTabPageHeader = Math.max(highestTabPageHeader, captionHeight + verticalInsets);
    }

    return Number.zeroIfNull(highestTabPageHeader);
  }

  public getCurrentTabPageTemplate(tabPage: TabPageWrapper): TabPageTemplate {
    if (tabPage.isTabSelected()) {
      return this.getTabPageTemplateActive();
    } else if (tabPage.getIsEditable() === false) {
      return this.getTabPageTemplateDisabled();
    } else {
      return this.getTabPageTemplateInactive();
    }
  }

  public getTabPageTemplateActive(): TabPageTemplate {
    if (!this.tabPageTemplateActive) {
      this.tabPageTemplateActive = this.createTabPageTemplateActive();
    }
    return this.tabPageTemplateActive;
  }

  public getTabPageTemplateDisabled(): TabPageTemplate {
    if (!this.tabPageTemplateDisabled) {
      this.tabPageTemplateDisabled = this.createTabPageTemplateDisabled();
    }
    return this.tabPageTemplateDisabled;
  }

  public getTabPageTemplateInactive(): TabPageTemplate {
    if (!this.tabPageTemplateInactive) {
      this.tabPageTemplateInactive = this.createTabPageTemplateInactive();
    }
    return this.tabPageTemplateInactive;
  }

  public getInactiveTabTemplateHeight(): number {
    const tabPageTemplate: TabPageTemplate = this.getTabPageTemplateInactive();
    const captionHeight: number = Number.zeroIfNull(tabPageTemplate.getLineHeight());
    const verticalInsets: number =
      Number.zeroIfNull(tabPageTemplate.getBorderThicknessTop()) +
      Number.zeroIfNull(tabPageTemplate.getPaddingTop()) +
      Number.zeroIfNull(tabPageTemplate.getPaddingBottom()) +
      Number.zeroIfNull(tabPageTemplate.getBorderThicknessBottom());
    return captionHeight + verticalInsets;
  }

  protected createTabPageTemplateActive(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateActive), this.getFontService());
  }

  protected createTabPageTemplateDisabled(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateDisabled), this.getFontService());
  }

  protected createTabPageTemplateInactive(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateInactive), this.getFontService());
  }

  public setIsEditableAtAction(pos: number, value: boolean): void {
    this.controls[pos].setIsEditableAction(value);
  }

  protected createLayout(): LayoutBase {
    return new TabbedLayout(this);
  }

  protected getComponentRef(): ComponentRef<TabbedWindowComponent> {
    return super.getComponentRef() as ComponentRef<TabbedWindowComponent>;
  }

  protected getComponent(): TabbedWindowComponent {
    const compRef: ComponentRef<TabbedWindowComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TabbedWindowComponent> {
    const factory: ComponentFactory<TabbedWindowComponent> = this.getResolver().resolveComponentFactory(TabbedWindowComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: TabbedWindowComponent): void {
    super.attachEvents(instance);

    if (this.hasOnSelectedTabPageChangeEvent()) {
      this.tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getOnSelectedTabPageChangeSubscription(tabPage)());
    } else if (this.hasOnSelectedTabPageChangedEvent()) {
      this.tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getOnSelectedTabPageChangedSubscription(tabPage)());
    } else {
      this.tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getNonEventTabPageChangedSubscription(tabPage)());
    }
  }

  protected detachEvents(): void {
    if (this.tabClickedSub) {
      this.tabClickedSub.unsubscribe();
    }
  }

  protected hasChanges(): boolean {
    return this.selectedTabIndex >= 0 && this.selectedTabIndex !== this.selectedTabIndexOrg;
  }

  protected getNonEventTabPageChangedSubscription(tabPage: TabPageWrapper): () => void {
    return () => {
      this.changeSelectedTabPage(tabPage);
      this.framesService.layout();
    };
  }

  public hasOnSelectedTabPageChangeEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChange) ? true : false;
  }

  protected getOnSelectedTabPageChangeSubscription(tabPage: TabPageWrapper): () => void {
    return () => this.getEventsService().fireSelectedTabPageChange(
      this.getForm().getId(),
      this.getName(),
      this.getTabPages()[this.selectedTabIndex].getName(),
      tabPage.getName(),
      tabPage,
      new InternalEventCallbacks<ClientSelectedTabPageChangeEvent>(
        this.canExecuteSelectedTabPageChange.bind(this),
        this.onSelectedTabPageChangeExecuted.bind(this),
        this.onSelectedTabPageChangeCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectedTabPageChange(clientEvent: ClientSelectedTabPageChangeEvent, payload: any): boolean {
    return this.hasOnSelectedTabPageChangeEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangeExecuted(clientEvent: ClientSelectedTabPageChangeEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangeCompleted(clientEvent: ClientSelectedTabPageChangeEvent, payload: any, processedEvent: any): void {
    if (this.hasOnSelectedTabPageChangedEvent() && processedEvent != null && processedEvent.args != null && !processedEvent.args.cancel) {
      this.getOnSelectedTabPageChangedSubscription(payload)();
    }
  }

  public hasOnSelectedTabPageChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChanged) ? true : false;
  }

  protected getOnSelectedTabPageChangedSubscription(tabPage: TabPageWrapper): () => void {
    this.changeSelectedTabPage(tabPage);
    return () => this.getEventsService().fireSelectedTabPageChanged(
      this.getForm().getId(),
      this.getName(),
      this.getTabPages()[this.selectedTabIndex].getName(),
      tabPage.getName(),
      new InternalEventCallbacks<ClientSelectedTabPageChangedEvent>(
        this.canExecuteSelectedTabPageChanged.bind(this),
        this.onSelectedTabPageChangedExecuted.bind(this),
        this.onSelectedTabPageChangedCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectedTabPageChanged(clientEvent: ClientSelectedTabPageChangedEvent, payload: any): boolean {
    return this.hasOnSelectedTabPageChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangedExecuted(clientEvent: ClientSelectedTabPageChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangedCompleted(clientEvent: ClientSelectedTabPageChangedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected changeSelectedTabPage(tabPage: TabPageWrapper): void {
    this.setSelectedTabIndex(this.getTabPages().indexOf(tabPage));
    this.validateSelectedTabIndex();
  }

  public getJson(): any {
    if (!this.hasChanges()) {
      return null;
    }

    const controlJson: any = {
      meta: {
        name: this.getName()
      },
      data: {
        selected: this.getSelectedTabIndex()
      }
    };

    return controlJson;
  }

  public setJson(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.selected && dataJson.selected.value !== undefined) {
      this.setSelectedTabIndexJson(dataJson.selected.value);
    }
  }

  public validateSelectedTabIndex(): void {
    const tabPages: Array<TabPageWrapper> = this.getTabPages();

    if (tabPages.length === 0) {
      this.setSelectedTabIndex(-1);
      return;
    }

    let actualTabIndex: number = this.selectedTabIndex != null ? this.selectedTabIndex : 0;

    if (this.selectedTabIndex < 0 || this.selectedTabIndex >= tabPages.length) {
      actualTabIndex = 0;
    }

    const tabPageForIndex: TabPageWrapper = tabPages[actualTabIndex];

    if (tabPageForIndex.getVisibility() !== Visibility.Visible) {
      const visibleTabPages: Array<TabPageWrapper> = tabPages.filter(t => t.getVisibility() === Visibility.Visible);

      if (visibleTabPages.length > 0) {
        actualTabIndex = tabPages.indexOf(visibleTabPages[0]);
      } else {
        actualTabIndex = -1;
      }
    }

    this.setSelectedTabIndex(actualTabIndex);
    this.scrollIntoView();
  }

  protected setSelectedTabIndexJson(value: string): void {
    const oldSelectedTabIndex: number = this.getSelectedTabIndex();

    let num: number = Number(value);
    num = !Number.isNaN(num) ? num : 0;

    this.selectedTabIndexOrg = num;
    this.setSelectedTabIndex(num);

    if (oldSelectedTabIndex !== num) {
      this.scrollIntoView();
    }
  }

  public getState(): any {
    const json: any = super.getState();
    json.selectedTabIndex = this.getSelectedTabIndex();
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);

    if (json.selectedTabIndex != null) {
      this.setSelectedTabIndexJson(json.selectedTabIndex);
    }
  }

  protected scrollIntoView(): void {
    const comp: TabbedWindowComponent = this.getComponent();
    if (comp != null) {
      comp.scrollIntoView();
    }
  }
}
