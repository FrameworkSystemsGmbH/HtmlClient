import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewItemComponent } from 'app/controls/listview/listview-item.component';
import { ViewContainerRef, Injector, ComponentFactoryResolver, ComponentRef, ViewRef } from '@angular/core';

export class ListViewItemWrapper {

  private _id: string;
  private _pos: number;
  private _selected: boolean;
  private _selectedOrg: boolean;
  private _listViewWrapper: ListViewWrapper;
  private _values: Array<ListViewItemValueWrapper>;
  private _cfr: ComponentFactoryResolver;
  private _componentRef: ComponentRef<ListViewItemComponent>;

  private _isNew: boolean;
  private _hasPosChanged: boolean;
  private _hasContentChanged: boolean;

  constructor(id: string, pos: number, listViewWrapper: ListViewWrapper, values: Array<ListViewItemValueWrapper>, injector: Injector) {
    this._id = id;
    this._pos = pos;
    this._listViewWrapper = listViewWrapper;
    this._values = values;
    this._isNew = true;
    this._cfr = injector.get(ComponentFactoryResolver);
  }

  public getId(): string {
    return this._id;
  }

  public getPos(): number {
    return this._pos;
  }

  public getSelected(): boolean {
    return this._selected;
  }

  public setSelected(selected: boolean): void {
    this._selected = selected;
  }

  public getValues(): Array<ListViewItemValueWrapper> {
    return this._values;
  }

  public getListViewWrapper(): ListViewWrapper {
    return this._listViewWrapper;
  }

  public notifySingleSelectionChanged(): void {
    this.getListViewWrapper().ensureSingleSelection(this);
  }

  private createComponent(listViewAnchor: ViewContainerRef): ComponentRef<ListViewItemComponent> {
    return this._cfr.resolveComponentFactory(ListViewItemComponent).create(listViewAnchor.injector);
  }

  private getComponentRef(): ComponentRef<ListViewItemComponent> {
    return this._componentRef;
  }

  private setComponentRef(componentRef: ComponentRef<ListViewItemComponent>): void {
    this._componentRef = componentRef;
  }

  private getComponent(): ListViewItemComponent {
    const compRef: ComponentRef<ListViewItemComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  private getHostView(): ViewRef {
    const compRef: ComponentRef<ListViewItemComponent> = this.getComponentRef();
    return compRef ? compRef.hostView : undefined;
  }

  public updateComponent(): void {
    const comp: ListViewItemComponent = this.getComponent();

    if (comp) {
      comp.updateComponent();
    }
  }

  public attachComponent(listViewAnchor: ViewContainerRef): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    this.detachComponent();

    // Create the Angular Component
    const compRef: ComponentRef<ListViewItemComponent> = this.createComponent(listViewAnchor);
    const compInstance: ListViewItemComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Register onDestroy handler of the Angular component
    compRef.onDestroy(this.onComponentDestroyed.bind(this));

    // Insert the Angular Component into the DOM
    listViewAnchor.insert(compRef.hostView);
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ListViewItemComponent> = this.getComponentRef();

    if (compRef != null) {
      compRef.destroy();
    }
  }

  protected onComponentDestroyed(): void {
    // Clear the Angular Component reference
    this._componentRef = null;
  }

  public ensureItemPos(listViewAnchor: ViewContainerRef): void {
    const hostView: ViewRef = this.getHostView();

    if (!hostView) {
      return;
    }

    const wrapperPos = this.getPos();
    const viewPos: number = listViewAnchor.indexOf(hostView);

    if (wrapperPos !== viewPos) {
      listViewAnchor.move(hostView, wrapperPos);
    }

    this.confirmPosUpdate();
  }

  public setPosJson(pos: number): void {
    if (this._pos !== pos) {
      this._hasPosChanged = true;
    }
    this._pos = pos;
  }

  public setSelectedJson(selected: boolean): void {
    if (this._selected !== selected) {
      this._hasContentChanged = true;
    }
    this._selected = selected;
    this._selectedOrg = selected;
  }

  public setValuesJson(values: Array<ListViewItemValueWrapper>): void {
    this._values = values;
    this._hasContentChanged = true;
  }

  public isNew(): boolean {
    return this._isNew;
  }

  public hasPosChanged(): boolean {
    return this._hasPosChanged;
  }

  public hasContentChanged(): boolean {
    return this._hasContentChanged;
  }

  public hasSelectionChanged(): boolean {
    return this._selected !== this._selectedOrg;
  }

  private confirmPosUpdate(): void {
    this._hasPosChanged = false;
  }

  public confirmContentUpdate(): void {
    this._isNew = false;
    this._hasContentChanged = false;
  }
}
