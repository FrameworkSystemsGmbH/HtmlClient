import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { TabbedWindowComponent } from '@app/controls/tabbed-window/tabbed-window.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { TabAlignment } from '@app/enums/tab-alignment';
import { Visibility } from '@app/enums/visibility';
import { LayoutBase } from '@app/layout/layout-base';
import { TabbedLayout } from '@app/layout/tabbed-layout/tabbed-layout';
import { ITabbedLayoutControl } from '@app/layout/tabbed-layout/tabbed-layout-control.interface';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TabPageTemplate } from '@app/wrappers/tabbed-window/tab-page-template';
import { TabPageWrapper } from '@app/wrappers/tabbed-window/tab-page-wrapper';
import { Subscription } from 'rxjs';

export class TabbedWindowWrapper extends ContainerWrapper implements ITabbedLayoutControl {

  private _tabPageTemplateActive: TabPageTemplate | null = null;
  private _tabPageTemplateDisabled: TabPageTemplate | null = null;
  private _tabPageTemplateInactive: TabPageTemplate | null = null;

  private _selectedTabIndex: number = 0;
  private _selectedTabIndexOrg: number = 0;

  private _tabClickedSub: Subscription | null = null;

  public getControlType(): ControlType {
    return ControlType.TabbedWindow;
  }

  public getIsMobileMode(): boolean {
    return this.getPlatformService().isNative();
  }

  public getSelectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  public setSelectedTabIndex(selectedTabIndex: number): void {
    this._selectedTabIndex = selectedTabIndex;
  }

  public getTabPages(): Array<TabPageWrapper> {
    return this.getVchContainer().getChildren() as Array<TabPageWrapper>;
  }

  public getTabAlignment(): TabAlignment {
    const alignment: TabAlignment | undefined = this.getPropertyStore().getTabAlignment();
    return alignment != null ? alignment : TabAlignment.Top;
  }

  public getActiveImage(): string | null {
    const activeImage: string | undefined = this.getPropertyStore().getActiveImage();
    return activeImage != null ? activeImage : null;
  }

  public getInactiveImage(): string | null {
    const inactiveImage: string | undefined = this.getPropertyStore().getInactiveImage();
    return inactiveImage != null ? inactiveImage : null;
  }

  public isTabSelected(tabPage: TabPageWrapper): boolean {
    return this.getTabPages().indexOf(tabPage) === this._selectedTabIndex;
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
    } else if (!tabPage.getIsEditable()) {
      return this.getTabPageTemplateDisabled();
    } else {
      return this.getTabPageTemplateInactive();
    }
  }

  public getTabPageTemplateActive(): TabPageTemplate {
    if (!this._tabPageTemplateActive) {
      this._tabPageTemplateActive = this.createTabPageTemplateActive();
    }
    return this._tabPageTemplateActive;
  }

  public getTabPageTemplateDisabled(): TabPageTemplate {
    if (!this._tabPageTemplateDisabled) {
      this._tabPageTemplateDisabled = this.createTabPageTemplateDisabled();
    }
    return this._tabPageTemplateDisabled;
  }

  public getTabPageTemplateInactive(): TabPageTemplate {
    if (!this._tabPageTemplateInactive) {
      this._tabPageTemplateInactive = this.createTabPageTemplateInactive();
    }
    return this._tabPageTemplateInactive;
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

  protected getComponentRef(): ComponentRef<TabbedWindowComponent> | null {
    return super.getComponentRef() as ComponentRef<TabbedWindowComponent> | null;
  }

  protected getComponent(): TabbedWindowComponent | null {
    const compRef: ComponentRef<TabbedWindowComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: TabbedWindowComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get TabbedWindowComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TabbedWindowComponent> {
    const factory: ComponentFactory<TabbedWindowComponent> = this.getResolver().resolveComponentFactory(TabbedWindowComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: TabbedWindowComponent): void {
    super.attachEvents(instance);

    if (this.hasOnSelectedTabPageChangeEvent()) {
      this._tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getOnSelectedTabPageChangeSubscription(tabPage)());
    } else if (this.hasOnSelectedTabPageChangedEvent()) {
      this._tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getOnSelectedTabPageChangedSubscription(tabPage)());
    } else {
      this._tabClickedSub = instance.tabClicked.subscribe((tabPage: TabPageWrapper) => this.getNonEventTabPageChangedSubscription(tabPage)());
    }
  }

  protected detachEvents(): void {
    if (this._tabClickedSub) {
      this._tabClickedSub.unsubscribe();
    }
  }

  protected hasChanges(): boolean {
    return this._selectedTabIndex >= 0 && this._selectedTabIndex !== this._selectedTabIndexOrg;
  }

  protected getNonEventTabPageChangedSubscription(tabPage: TabPageWrapper): () => void {
    return (): void => {
      this.changeSelectedTabPage(tabPage);
      this.getFramesService().layout();
    };
  }

  public hasOnSelectedTabPageChangeEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChange) === ClientEventType.OnSelectedTabPageChange;
  }

  protected getOnSelectedTabPageChangeSubscription(tabPage: TabPageWrapper): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form) {
        this.getEventsService().fireSelectedTabPageChange(
          form.getId(),
          this.getName(),
          this.getTabPages()[this._selectedTabIndex].getName(),
          tabPage.getName(),
          tabPage,
          new InternalEventCallbacks(
            this.canExecuteSelectedTabPageChange.bind(this),
            this.onSelectedTabPageChangeExecuted.bind(this),
            this.onSelectedTabPageChangeCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteSelectedTabPageChange(payload: any): boolean {
    return this.hasOnSelectedTabPageChangeEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangeExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangeCompleted(payload: any, processedEvent: any): void {
    if (this.hasOnSelectedTabPageChangedEvent() && processedEvent != null && processedEvent.args != null && !processedEvent.args.cancel) {
      this.getOnSelectedTabPageChangedSubscription(payload)();
    }
  }

  public hasOnSelectedTabPageChangedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnSelectedTabPageChanged) === ClientEventType.OnSelectedTabPageChanged;
  }

  protected getOnSelectedTabPageChangedSubscription(tabPage: TabPageWrapper): () => void {
    this.changeSelectedTabPage(tabPage);
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form) {
        this.getEventsService().fireSelectedTabPageChanged(
          form.getId(),
          this.getName(),
          this.getTabPages()[this._selectedTabIndex].getName(),
          tabPage.getName(),
          new InternalEventCallbacks(
            this.canExecuteSelectedTabPageChanged.bind(this),
            this.onSelectedTabPageChangedExecuted.bind(this),
            this.onSelectedTabPageChangedCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteSelectedTabPageChanged(payload: any): boolean {
    return this.hasOnSelectedTabPageChangedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onSelectedTabPageChangedExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onSelectedTabPageChangedCompleted(payload: any, processedEvent: any): void {
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

    let actualTabIndex: number = this._selectedTabIndex;

    if (this._selectedTabIndex < 0 || this._selectedTabIndex >= tabPages.length) {
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

    this._selectedTabIndexOrg = num;
    this.setSelectedTabIndex(num);

    if (oldSelectedTabIndex !== num) {
      this.scrollIntoView();
    }
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.selectedTabIndex = this.getSelectedTabIndex();
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    if (json.selectedTabIndex != null) {
      this.setSelectedTabIndexJson(json.selectedTabIndex);
    }
  }

  protected scrollIntoView(): void {
    const comp: TabbedWindowComponent | null = this.getComponent();
    if (comp != null) {
      comp.scrollIntoView();
    }
  }
}
