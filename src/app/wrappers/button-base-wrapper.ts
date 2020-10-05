import { ComponentRef } from '@angular/core';
import { ClientClickEvent } from '@app/common/events/client-click-event';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { PropertyLayer } from '@app/common/property-layer';
import { ButtonComponent } from '@app/controls/buttons/button.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { Visibility } from '@app/enums/visibility';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { Subscription } from 'rxjs';

export abstract class ButtonBaseWrapper extends FittedWrapper {

  private btnClickSub: Subscription;

  public mapEnterToTab(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getMapEnterToTab());
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getShowCaption());
  }

  public providesControlLabelWrapper(): boolean {
    return false;
  }

  protected getComponentRef(): ComponentRef<ButtonComponent> {
    return super.getComponentRef() as ComponentRef<ButtonComponent>;
  }

  protected getComponent(): ButtonComponent {
    const compRef: ComponentRef<ButtonComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.caption) {
      this.getPropertyStore().setCaption(PropertyLayer.Control, dataJson.caption);
    }
  }

  protected attachEvents(instance: ButtonComponent): void {
    super.attachEvents(instance);

    if (this.getEvents() & ClientEventType.OnClick) {
      this.btnClickSub = instance.btnClick.subscribe(() => this.getBtnClickSubscription()());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.btnClickSub) {
      this.btnClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) ? true : false;
  }

  protected getBtnClickSubscription(): () => void {
    return () => this.getEventsService().fireClick(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientClickEvent>(
        this.canExecuteBtnClick.bind(this),
        this.btnClickExecuted.bind(this),
        this.btnClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteBtnClick(clientEvent: ClientClickEvent, payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected btnClickExecuted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected btnClickCompleted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public fireClick(): void {
    const comp: ButtonComponent = this.getComponent();

    if (comp) {
      comp.callBtnClick();
    }
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.getFontService().measureTextWidth(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
    } else {
      this.setFittedContentWidth(null);
    }
  }

  public updateFittedHeight(): void {
    if (this.showCaption()) {
      this.setFittedContentHeight(this.getFontService().measureTextHeight(this.getFontFamily(), this.getFontSize()));
    } else {
      this.setFittedContentHeight(null);
    }
  }
}
