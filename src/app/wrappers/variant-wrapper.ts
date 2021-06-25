import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { PropertyLayer } from '@app/common/property-layer';
import { VariantComponent } from '@app/controls/variant/variant.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { ImageService } from '@app/services/image.service';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export class VariantWrapper extends ContainerWrapper {

  private _imageService: ImageService;

  private _badgeImageData: string;
  private _dataSourceType: DataSourceType;

  protected init(): void {
    super.init();
    this._imageService = this.getInjector().get(ImageService);
  }

  public getControlType(): ControlType {
    return ControlType.Variant;
  }

  public getTitle(): string {
    return this.getPropertyStore().getTitle();
  }

  public setTitle(title: string): void {
    this.getPropertyStore().setTitle(PropertyLayer.Action, title);
  }

  public getIsCloseIconVisible(): boolean {
    const isCloseIconVisible: boolean = this.getPropertyStore().getIsCloseIconVisible();
    return isCloseIconVisible != null ? isCloseIconVisible : false;
  }

  public getHideModalHeader(): boolean {
    const hideModalHeader: boolean = this.getPropertyStore().getHideModalHeader();
    return hideModalHeader != null ? hideModalHeader : false;
  }

  public isCloseEventAttached(): boolean {
    return (this.getEvents() & ClientEventType.OnClose) === ClientEventType.OnClose;
  }

  public getBadgeImageSrc(): string {
    if (!String.isNullOrWhiteSpace(this._badgeImageData)) {
      if (this._dataSourceType === DataSourceType.ByteArray) {
        return `data:;base64,${this._badgeImageData}`;
      } else {
        return this._imageService.getImageUrl(this._badgeImageData);
      }
    }

    return null;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.badgeImage && dataJson.badgeImage.type != null && !String.isNullOrWhiteSpace(dataJson.badgeImage.value)) {
      this._dataSourceType = dataJson.badgeImage.type;
      this._badgeImageData = dataJson.badgeImage.value;
    }
  }

  protected getComponentRef(): ComponentRef<VariantComponent> {
    return super.getComponentRef() as ComponentRef<VariantComponent>;
  }

  protected getComponent(): VariantComponent {
    const compRef: ComponentRef<VariantComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
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
