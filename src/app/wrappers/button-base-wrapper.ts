import { ISubscription } from 'rxjs/Subscription';

import { BaseWrapperFitted } from '.';
import { ControlEvent } from '../enums';
import { ButtonBaseComponent } from '../controls';
import { PropertyLayer } from '../common';

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
      this.onClickSub = instance.onClick.subscribe(event => this.eventsService.fireClick(this.getForm().getId(), this.getName()));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }
  }

  public updateFittedWidth(): void {
    if (this.showCaption()) {
      this.setFittedContentWidth(this.fontService.measureText(this.getCaption(), this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()));
    } else {
      this.setFittedContentWidth(null);
    }
  }

}
