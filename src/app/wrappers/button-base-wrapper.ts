import { ISubscription } from 'rxjs/Subscription';

import { ButtonBaseComponent } from '../controls/button-base.component';
import { BaseWrapperFitted } from './base-wrapper-fitted';
import { PropertyLayer } from '../common/property-layer';
import { ControlVisibility } from '../enums/control-visibility';
import { ControlEvent } from '../enums/control-event';

export abstract class ButtonBaseWrapper extends BaseWrapperFitted {

  private onClickSub: ISubscription;

  public getCaption(): string {
    let caption: string = this.propertyStore.getCaption();
    return caption != null ? caption : null;
  }

  public showCaption(): boolean {
    return Boolean.trueIfNull(this.propertyStore.getShowCaption());
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.caption) {
      this.propertyStore.setCaption(PropertyLayer.Control, dataJson.caption);
    }
  }

  protected attachEvents(instance: ButtonBaseComponent): void {
    super.attachEvents(instance);

    if (this.events & ControlEvent.OnClick) {
      this.onClickSub = instance.onClick
        .subscribe(event => this.getOnClickSubscription()(event));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnClick) ? true : false;
  }

  protected getOnClickSubscription(): (event: any) => void {
    return (event: any) => this.eventsService.fireClick(
      this.getForm().getId(),
      this.getName(),
      {
        canExecute: this.canExecuteClick.bind(this),
        onExecuted: this.onClickExecuted.bind(this),
        onCompleted: this.onClickCompleted.bind(this)
      }
    );
  }

  protected canExecuteClick(): boolean {
    return this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onClickExecuted(): void {
    // Override in subclasses
  }

  protected onClickCompleted(): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
    } else {
      this.setFittedContentWidth(null);
    }
  }

}
