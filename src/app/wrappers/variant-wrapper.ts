import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { VariantComponent } from '@app/controls/variant/variant.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { DataSourceType } from '@app/enums/datasource-type';
import { ImageService } from '@app/services/image.service';

export class VariantWrapper extends ContainerWrapper {

  private imageService: ImageService;

  private badgeImageData: string;
  private dataSourceType: DataSourceType;

  protected init(): void {
    super.init();
    this.imageService = this.getInjector().get(ImageService);
  }

  public getControlType(): ControlType {
    return ControlType.Variant;
  }

  public getTitle(): string {
    return this.getPropertyStore().getTitle();
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
    if (!String.isNullOrWhiteSpace(this.badgeImageData)) {
      if (this.dataSourceType === DataSourceType.ByteArray) {
        return `data:;base64,${this.badgeImageData}`;
      } else {
        return this.imageService.getImageUrl(this.badgeImageData);
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
      this.dataSourceType = dataJson.badgeImage.type;
      this.badgeImageData = dataJson.badgeImage.value;
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

  public getState(): any {
    const json: any = super.getState();
    json.type = this.dataSourceType;
    json.badgeImageData = this.badgeImageData;
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.dataSourceType = json.type;
    this.badgeImageData = json.badgeImageData;
  }
}
