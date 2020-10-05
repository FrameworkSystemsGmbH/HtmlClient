import { ComponentRef, ComponentFactory } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlType } from '@app/enums/control-type';
import { ClientClickEvent } from '@app/common/events/client-click-event';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { DataSourceType } from '@app/enums/datasource-type';
import { ClientEventType } from '@app/enums/client-event-type';
import { Visibility } from '@app/enums/visibility';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { PictureComponent } from '@app/controls/picture/picture.component';
import { PictureScaleMode } from '@app/enums/picture-scale-mode';
import { ImageService } from '@app/services/image.service';
import { ContentAlignment } from '@app/enums/content-alignment';
import { ClientPictureClickEvent } from '@app/common/events/client-picture-click-event';
import { ClientPictureClickEventArgs } from '@app/common/events/eventargs/client-picture-click-eventargs';

export class PictureWrapper extends ControlWrapper {

  private picClickSub: Subscription;

  private imageData: string;
  private dataSourceType: DataSourceType;

  private imageService: ImageService;

  protected init(): void {
    super.init();
    this.imageService = this.getInjector().get(ImageService);
    this.dataSourceType = DataSourceType.ByteArray;
  }

  public getControlType(): ControlType {
    return ControlType.Picture;
  }

  public getImageSrc(): string {
    if (!String.isNullOrWhiteSpace(this.imageData)) {
      if (this.dataSourceType === DataSourceType.ByteArray) {
        return `data:;base64,${this.imageData}`;
      } else {
        return this.imageService.getImageUrl(this.imageData);
      }
    } else {
      const imageUrl: string = this.getPropertyStore().getImage();
      if (!String.isNullOrWhiteSpace(imageUrl)) {
        return this.imageService.getImageUrl(imageUrl);
      }
    }

    return null;
  }

  public getScaleMode(): PictureScaleMode {
    const scaleMode: PictureScaleMode = this.getPropertyStore().getScaleMode();
    return scaleMode != null ? scaleMode : PictureScaleMode.Stretch;
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getShowCaption());
  }

  public getCaptionAlign(): ContentAlignment {
    const captionAlign: ContentAlignment = this.getPropertyStore().getCaptionAlign();
    return captionAlign != null ? captionAlign : ContentAlignment.MiddleCenter;
  }

  public providesControlLabelWrapper(): boolean {
    return super.providesControlLabelWrapper() && !this.showCaption();
  }

  public setImageUrlAction(url: string): void {
    this.dataSourceType = DataSourceType.String;
    this.imageData = url;
  }

  public setImageBytesAction(bytes: string): void {
    this.dataSourceType = DataSourceType.ByteArray;
    this.imageData = bytes;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.text && dataJson.text.type != null && !String.isNullOrWhiteSpace(dataJson.text.value)) {
      this.dataSourceType = dataJson.text.type;
      this.imageData = dataJson.text.value;
    }
  }

  protected getComponentRef(): ComponentRef<PictureComponent> {
    return super.getComponentRef() as ComponentRef<PictureComponent>;
  }

  protected getComponent(): PictureComponent {
    const compRef: ComponentRef<PictureComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<PictureComponent> {
    const factory: ComponentFactory<PictureComponent> = this.getResolver().resolveComponentFactory(PictureComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: PictureComponent): void {
    super.attachEvents(instance);

    if (this.getEvents() & ClientEventType.OnClick) {
      this.picClickSub = instance.picClick.subscribe((args: ClientPictureClickEventArgs) => this.getPicClickSubscription(args)());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.picClickSub) {
      this.picClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) ? true : false;
  }

  protected getPicClickSubscription(args: ClientPictureClickEventArgs): () => void {
    return () => this.getEventsService().firePictureClick(
      this.getForm().getId(),
      this.getName(),
      args,
      new InternalEventCallbacks<ClientPictureClickEvent>(
        this.canExecutePicClick.bind(this),
        this.picClickExecuted.bind(this),
        this.picClickCompleted.bind(this)
      )
    );
  }

  protected canExecutePicClick(clientEvent: ClientClickEvent, payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected picClickExecuted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected picClickCompleted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public getState(): any {
    const json: any = super.getState();
    json.type = this.dataSourceType;
    json.imageData = this.imageData;
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);
    this.dataSourceType = json.type;
    this.imageData = json.imageData;
  }
}
