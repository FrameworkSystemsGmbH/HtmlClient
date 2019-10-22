import { ComponentRef, ComponentFactory } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlType } from 'app/enums/control-type';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { DataSourceType } from 'app/enums/datasource-type';
import { ClientEventType } from 'app/enums/client-event-type';
import { Visibility } from 'app/enums/visibility';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { PictureComponent } from 'app/controls/picture/picture.component';
import { PictureScaleMode } from 'app/enums/picture-scale-mode';
import { ImageService } from 'app/services/image.service';
import { ContentAlignment } from 'app/enums/content-alignment';
import { ClientPictureClickEvent } from 'app/common/events/client-picture-click-event';
import { ClientPictureClickEventArgs } from 'app/common/events/eventargs/client-picture-click-eventargs';

export class PictureWrapper extends ControlWrapper {

  private onClickSub: Subscription;

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
      this.onClickSub = instance.onClick.subscribe(clickEventParams => this.getOnClickSubscription(clickEventParams.event, clickEventParams.args)());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) ? true : false;
  }

  protected getOnClickSubscription(event: any, args: ClientPictureClickEventArgs): () => void {
    return () => this.getEventsService().firePictureClick(
      this.getForm().getId(),
      this.getName(),
      args,
      event,
      new InternalEventCallbacks<ClientPictureClickEvent>(
        this.canExecuteClick.bind(this),
        this.onClickExecuted.bind(this),
        this.onClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteClick(originalEvent: any, clientEvent: ClientClickEvent): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onClickExecuted(originalEvent: any, clientEvent: ClientClickEvent): void {
    // Override in subclasses
  }

  protected onClickCompleted(originalEvent: any, clientEvent: ClientClickEvent): void {
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
