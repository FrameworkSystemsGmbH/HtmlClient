import { ComponentRef } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { PropertyLayer } from '@app/common/property-layer';
import { ButtonComponent } from '@app/controls/buttons/button.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { Visibility } from '@app/enums/visibility';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { Subscription } from 'rxjs';

export abstract class ButtonBaseWrapper extends FittedWrapper {

  private _btnClickSub: Subscription | null = null;

  public mapEnterToTab(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getMapEnterToTab());
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.getPropertyStore().getShowCaption());
  }

  public providesControlLabelWrapper(): boolean {
    return false;
  }

  protected getComponentRef(): ComponentRef<ButtonComponent> | null {
    return super.getComponentRef() as ComponentRef<ButtonComponent> | null;
  }

  protected getComponent(): ButtonComponent | null {
    const compRef: ComponentRef<ButtonComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
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

    if (this.hasOnClickEvent()) {
      this._btnClickSub = instance.btnClick.subscribe(() => this.getBtnClickSubscription()());
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this._btnClickSub) {
      this._btnClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) === ClientEventType.OnClick;
  }

  protected getBtnClickSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireClick(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteBtnClick.bind(this),
            this.btnClickExecuted.bind(this),
            this.btnClickCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteBtnClick(payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected btnClickExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected btnClickCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public fireClick(): void {
    const comp: ButtonComponent | null = this.getComponent();

    if (comp) {
      comp.callBtnClick();
    }
  }

  public updateFittedWidth(): void {
    const caption: string | null = this.getCaption();
    if (this.showCaption() && caption != null) {
      this.setFittedContentWidth(this.getFontService().measureTextWidth(caption, this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
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
