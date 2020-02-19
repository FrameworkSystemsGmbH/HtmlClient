import { Subscription } from 'rxjs';

import { ButtonComponent } from 'app/controls/buttons/button.component';
import { FittedWrapper } from 'app/wrappers/fitted-wrapper';
import { PropertyLayer } from 'app/common/property-layer';
import { Visibility } from 'app/enums/visibility';
import { ClientEventType } from 'app/enums/client-event-type';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { ComponentRef } from '@angular/core';

export abstract class ButtonBaseWrapper extends FittedWrapper {

  private onClickSub: Subscription;

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
      this.onClickSub = instance.onClick.subscribe(() => this.getOnClickSubscription()());
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

  protected getOnClickSubscription(): () => void {
    return () => this.getEventsService().fireClick(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientClickEvent>(
        this.canExecuteClick.bind(this),
        this.onClickExecuted.bind(this),
        this.onClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteClick(clientEvent: ClientClickEvent, payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onClickExecuted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onClickCompleted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public fireClick(): void {
    const comp: ButtonComponent = this.getComponent();

    if (comp) {
      comp.callOnClick();
    }
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.getFontService().measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
    } else {
      this.setFittedContentWidth(null);
    }
  }
}
