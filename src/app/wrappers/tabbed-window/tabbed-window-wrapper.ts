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
import { FontService } from 'app/services/font.service';
import { ClientEventType } from 'app/enums/client-event-type';
import { ClientSelectedTabPageChangeEvent } from 'app/common/events/client-selected-tab-page-change-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientSelectedTabPageChangedEvent } from 'app/common/events/client-selected-tab-page-changed-event';

export class TabbedWindowWrapper extends ContainerWrapper implements ITabbedLayoutControl {

  private tabPageTemplateActive: TabPageTemplate;
  private tabPageTemplateDisabled: TabPageTemplate;
  private tabPageTemplateInactive: TabPageTemplate;

  private selectedTabIndex: number;
  private selectedTabIndexOrg: number;

  private fontService: FontService;

  private onTabClickedSub: Subscription;

  protected init(): void {
    super.init();
    this.fontService = this.getInjector().get(FontService);
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

  public getWidestTabPageHeader(): number {
    const visibleTabPages: Array<TabPageWrapper> = this.getTabPages().filter(t => t.getVisibility() === Visibility.Visible);

    let widestTabPageHeader: number = 0;

    for (const tabPage of visibleTabPages) {
      const tabPageTemplate: TabPageTemplate = this.getCurrentTabPageTemplate(tabPage);
      const captionWidth: number = this.fontService.measureText(tabPage.getCaption(), tabPageTemplate.getFontFamily(), tabPageTemplate.getFontSize(), tabPageTemplate.getFontBold(), tabPageTemplate.getFontItalic());
      const horizontalInsets: number = tabPageTemplate.getBorderThicknessLeft() + tabPageTemplate.getPaddingLeft() + tabPageTemplate.getPaddingRight() + tabPageTemplate.getBorderThicknessRight();
      widestTabPageHeader = Math.max(widestTabPageHeader, captionWidth + horizontalInsets);
    }

    return Number.zeroIfNull(widestTabPageHeader);
  }

  public getHighestTabPageHeader(): number {
    const visibleTabPages: Array<TabPageWrapper> = this.getTabPages().filter(t => t.getVisibility() === Visibility.Visible);

    let highestTabPageHeader: number = 0;

    for (const tabPage of visibleTabPages) {
      const tabPageTemplate: TabPageTemplate = this.getCurrentTabPageTemplate(tabPage);
      const captionHeight: number = tabPageTemplate.getLineHeight();
      const verticalInsets: number = tabPageTemplate.getBorderThicknessTop() + tabPageTemplate.getPaddingTop() + tabPageTemplate.getPaddingBottom() + tabPageTemplate.getBorderThicknessBottom();
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

  protected createTabPageTemplateActive(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateActive));
  }

  protected createTabPageTemplateDisabled(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateDisabled));
  }

  protected createTabPageTemplateInactive(): TabPageTemplate {
    return new TabPageTemplate(this.getPropertyStore().getPropertyStore(data => data.tabTemplateInactive));
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
      this.onTabClickedSub = instance.onTabClicked.subscribe((payload: { tabPage: TabPageWrapper; event: any }) => this.getOnSelectedTabPageChangeSubscription(payload)());
    } else if (this.hasOnSelectedTabPageChangedEvent()) {
      this.onTabClickedSub = instance.onTabClicked.subscribe((payload: { tabPage: TabPageWrapper; event: any }) => this.getOnSelectedTabPageChangedSubscription(payload)());
    }
  }

  protected detachEvents(): void {
    if (this.onTabClickedSub) {
      this.onTabClickedSub.unsubscribe();
    }
  }

  protected hasChanges(): boolean {
    return this.selectedTabIndex >= 0 && this.selectedTabIndex !== this.selectedTabIndexOrg;
  }

  public hasOnSelectedTabPageChangeEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChange) ? true : false;
  }

  protected getOnSelectedTabPageChangeSubscription(payload: { tabPage: TabPageWrapper; event: any }): () => void {
    return () => this.getEventsService().fireSelectedTabPageChange(
      this.getForm().getId(),
      this.getName(),
      this.getTabPages()[this.selectedTabIndex].getName(),
      payload.tabPage.getName(),
      payload,
      new InternalEventCallbacks<ClientSelectedTabPageChangeEvent>(
        this.canExecuteSelectedTabPageChange.bind(this),
        this.onSelectedTabPageChangeExecuted.bind(this),
        this.onSelectedTabPageChangeCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectedTabPageChange(originalEvent: any, clientEvent: ClientSelectedTabPageChangeEvent): boolean {
    return this.hasOnSelectedTabPageChangeEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangeExecuted(originalEvent: any, clientEvent: ClientSelectedTabPageChangeEvent, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangeCompleted(originalEvent: any, clientEvent: ClientSelectedTabPageChangeEvent, processedEvent: any): void {
    if (this.hasOnSelectedTabPageChangedEvent() && processedEvent != null && processedEvent.args != null && !processedEvent.args.cancel) {
      this.getOnSelectedTabPageChangedSubscription(originalEvent)();
    }
  }

  public hasOnSelectedTabPageChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChanged) ? true : false;
  }

  protected getOnSelectedTabPageChangedSubscription(payload: { tabPage: TabPageWrapper; event: any }): () => void {
    this.setSelectedTabIndex(this.getTabPages().indexOf(payload.tabPage));
    this.validateSelectedTabIndex();
    return () => this.getEventsService().fireSelectedTabPageChanged(
      this.getForm().getId(),
      this.getName(),
      this.getTabPages()[this.selectedTabIndex].getName(),
      payload.tabPage.getName(),
      payload.event,
      new InternalEventCallbacks<ClientSelectedTabPageChangedEvent>(
        this.canExecuteSelectedTabPageChanged.bind(this),
        this.onSelectedTabPageChangedExecuted.bind(this),
        this.onSelectedTabPageChangedCompleted.bind(this)
      )
    );
  }

  protected canExecuteSelectedTabPageChanged(originalEvent: any, clientEvent: ClientSelectedTabPageChangedEvent): boolean {
    return this.hasOnSelectedTabPageChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangedExecuted(originalEvent: any, clientEvent: ClientSelectedTabPageChangedEvent): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangedCompleted(originalEvent: any, clientEvent: ClientSelectedTabPageChangedEvent): void {
    // Override in subclasses
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

  public setJason(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
    this.afterChildrenInitialized();
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

  protected afterChildrenInitialized(): void {
    this.validateSelectedTabIndex();
  }

  protected validateSelectedTabIndex(): void {
    const tabPages: Array<TabPageWrapper> = this.getTabPages();

    if (tabPages.length === 0) {
      this.setSelectedTabIndex(-1);
      return;
    }

    let actualTabIndex: number = this.selectedTabIndex;

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
  }

  protected setSelectedTabIndexJson(value: string): void {
    let num: number = Number(value);
    num = !Number.isNaN(num) ? num : 0;
    this.selectedTabIndexOrg = num;
    this.setSelectedTabIndex(num);

    const comp: TabbedWindowComponent = this.getComponent();
    if (comp != null) {
      comp.scrollIntoView();
    }
  }
}