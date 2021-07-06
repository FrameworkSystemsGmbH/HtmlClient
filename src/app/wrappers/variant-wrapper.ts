import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { PropertyLayer } from '@app/common/property-layer';
import { VariantComponent } from '@app/controls/variant/variant.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class VariantWrapper extends ContainerWrapper {

  private _badgeImageData: string | null = null;
  private _dataSourceType: DataSourceType | null = null;

  public getControlType(): ControlType {
    return ControlType.Variant;
  }

  public getTitle(): string | null {
    const title: string | undefined = this.getPropertyStore().getTitle();
    return title != null ? title : null;
  }

  public setTitle(title: string): void {
    this.getPropertyStore().setTitle(PropertyLayer.Action, title);
  }

  public getIsCloseIconVisible(): boolean {
    const isCloseIconVisible: boolean | undefined = this.getPropertyStore().getIsCloseIconVisible();
    return isCloseIconVisible != null ? isCloseIconVisible : false;
  }

  public getHideModalHeader(): boolean {
    const hideModalHeader: boolean | undefined = this.getPropertyStore().getHideModalHeader();
    return hideModalHeader != null ? hideModalHeader : false;
  }

  public isCloseEventAttached(): boolean {
    return (this.getEvents() & ClientEventType.OnClose) === ClientEventType.OnClose;
  }

  public getBadgeImageSrc(): string | null {
    if (this._badgeImageData != null && this._badgeImageData.trim().length > 0) {
      if (this._dataSourceType === DataSourceType.ByteArray) {
        return `data:;base64,${this._badgeImageData}`;
      } else {
        return this.getImageService().getImageUrl(this._badgeImageData);
      }
    }

    return null;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.badgeImage && dataJson.badgeImage.type != null && dataJson.badgeImage.value != null && dataJson.badgeImage.value.trim().length > 0) {
      this._dataSourceType = dataJson.badgeImage.type;
      this._badgeImageData = dataJson.badgeImage.value;
    }
  }

  protected getComponentRef(): ComponentRef<VariantComponent> | null {
    return super.getComponentRef() as ComponentRef<VariantComponent> | null;
  }

  protected getComponent(): VariantComponent | null {
    const compRef: ComponentRef<VariantComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: VariantComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get VariantComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<VariantComponent> {
    const factory: ComponentFactory<VariantComponent> = this.getResolver().resolveComponentFactory(VariantComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.type = this._dataSourceType;
    json.badgeImageData = this._badgeImageData;
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this._dataSourceType = json.type;
    this._badgeImageData = json.badgeImageData;
  }
}
