import { ComponentFactoryResolver, ComponentRef, Injector, ViewContainerRef, ViewRef } from '@angular/core';
import { ListViewItemComponent } from '@app/controls/listview/listview-item.component';
import { ListViewItemValueWrapper } from '@app/wrappers/listview-item-value-wrapper';
import { ListViewWrapper } from '@app/wrappers/listview-wrapper';

export interface IListViewItemWrapperOptions {
  listViewWrapper: ListViewWrapper;
  id?: string;
  pos?: number;
  values?: Array<ListViewItemValueWrapper>;
  state?: any;
}

export class ListViewItemWrapper {

  private readonly _listViewWrapper: ListViewWrapper;
  private readonly _cfr: ComponentFactoryResolver;

  private _id: string = String.empty();
  private _pos: number | null = null;
  private _selected: boolean = false;
  private _selectedOrg: boolean = false;
  private _values: Array<ListViewItemValueWrapper> = new Array<ListViewItemValueWrapper>();
  private _componentRef: ComponentRef<ListViewItemComponent> | null = null;

  private _isNew: boolean;
  private _isAttached: boolean;
  private _hasPosChanged: boolean = false;
  private _hasContentChanged: boolean = false;

  public constructor(injector: Injector, options: IListViewItemWrapperOptions) {
    this._isNew = true;
    this._isAttached = false;
    this._cfr = injector.get(ComponentFactoryResolver);

    this._listViewWrapper = options.listViewWrapper;

    if (options.state) {
      this.loadState(options.state);
    } else {
      this._id = options.id ? options.id : String.empty();
      this._pos = options.pos ? options.pos : null;
      this._values = options.values ? options.values : new Array<ListViewItemValueWrapper>();
    }
  }

  public getId(): string {
    return this._id;
  }

  public getPos(): number | null {
    return this._pos;
  }

  public getSelected(): boolean {
    return this._selected;
  }

  public setSelected(selected: boolean): void {
    this._selected = selected;
  }

  public getViewTemplateValues(): Array<ListViewItemValueWrapper> {
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

  private getComponentRef(): ComponentRef<ListViewItemComponent> | null {
    return this._componentRef;
  }

  private setComponentRef(componentRef: ComponentRef<ListViewItemComponent>): void {
    this._componentRef = componentRef;
  }

  private getComponent(): ListViewItemComponent | null {
    const compRef: ComponentRef<ListViewItemComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  private getHostView(): ViewRef | null {
    const compRef: ComponentRef<ListViewItemComponent> | null = this.getComponentRef();
    return compRef ? compRef.hostView : null;
  }

  public updateComponent(): void {
    const comp: ListViewItemComponent | null = this.getComponent();

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

    // Insert the Angular Component into the DOM
    listViewAnchor.insert(compRef.hostView);

    this._isAttached = true;
  }

  public detachComponent(): void {
    const compRef: ComponentRef<ListViewItemComponent> | null = this.getComponentRef();

    if (compRef != null) {
      compRef.destroy();
    }
  }

  public onComponentDestroyed(): void {
    // Clear the Angular Component reference
    this._componentRef = null;
    this._isAttached = false;
  }

  public ensureItemPos(listViewAnchor: ViewContainerRef): void {
    const hostView: ViewRef | null = this.getHostView();

    if (!hostView) {
      return;
    }

    const wrapperPos: number | null = this.getPos();

    if (wrapperPos == null) {
      return;
    }

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

  public isAttached(): boolean {
    return this._isAttached;
  }

  public hasPosChanged(): boolean {
    return this._hasPosChanged;
  }

  public hasContentChanged(): boolean {
    return this._hasContentChanged;
  }

  public markAsContentChanged(): void {
    this._hasContentChanged = true;
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

  public saveState(): any {
    const json: any = {
      id: this._id,
      pos: this._pos,
      selected: this._selected,
      selectedOrg: this._selectedOrg
    };

    const valuesJson: Array<any> = new Array<any>();

    for (const value of this._values) {
      valuesJson.push({
        value: value.getValue(),
        format: value.getFormat(),
        formatPattern: value.getFormatPattern()
      });
    }

    if (valuesJson.length > 0) {
      json.values = valuesJson;
    }

    return json;
  }

  protected loadState(json: any): void {
    this._id = json.id;
    this._pos = json.pos;
    this._selected = json.selected;
    this._selectedOrg = json.selectedOrg;

    if (json.values != null && json.values.length > 0) {
      this._values = new Array<ListViewItemValueWrapper>();
      for (const valueJson of json.values) {
        this._values.push(new ListViewItemValueWrapper(valueJson.value, valueJson.format, valueJson.formatPattern));
      }
    }
  }
}
