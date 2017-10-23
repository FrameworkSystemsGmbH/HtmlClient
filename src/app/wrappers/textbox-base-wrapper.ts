import { ComponentFactoryResolver } from '@angular/core';

import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';
import { IFontService } from '../services/font.service';
import { IPatternFormatService } from '../services/formatter/pattern-format.service';

import { TextBoxBaseComponent } from '../controls/textbox-base.component';
import { FormWrapper } from './form-wrapper';
import { ContainerWrapper } from './container-wrapper';
import { BaseWrapperFittedData } from './base-wrapper-fitted-data';
import { PropertyData } from '../common/property-data';
import { TextAlign } from '../enums/text-align';
import { TextFormat } from '../enums/text-format';
import { InternalEventCallbacks } from '../common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from '../common/events/client-enter-event';
import { ClientValidatedEvent } from '../common/events/client-validated-event';
import { ControlEvent } from '../enums/control-event';
import { ControlVisibility } from '../enums/control-visibility';

export abstract class TextBoxBaseWrapper extends BaseWrapperFittedData {

  private readonly patternFormatService: IPatternFormatService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService,
    patternFormatService: IPatternFormatService
  ) {
    super(form, parent, controlStyle, resolver, eventsService, focusService, fontService);
    this.patternFormatService = patternFormatService;
  }

  protected getComponent(): TextBoxBaseComponent {
    return super.getComponent() as TextBoxBaseComponent;
  }

  public getDisabledBackColor(): string {
    let disabledBackColor: string = this.propertyStore.getDisabledBackColor();
    return disabledBackColor != null ? disabledBackColor : '#CCCCCC';
  }

  public getCaption(): string {
    let caption: string = this.propertyStore.getCaption();
    return caption != null ? caption : null;
  }

  public getTextAlign(): TextAlign {
    let textAlign: TextAlign = this.propertyStore.getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Left;
  }

  public getMaxScale(): number {
    let maxScale: number = this.propertyStore.getMaxScale();
    return maxScale != null ? maxScale : 2;
  }

  public getMaxPrec(): number {
    let maxPrec: number = this.propertyStore.getMaxPrec();
    return maxPrec != null ? maxPrec : 18;
  }

  public getFormat(): TextFormat {
    let textFormat: TextFormat = this.propertyStore.getFormat();
    return textFormat != null ? textFormat : TextFormat.None;
  }

  public getFormatPattern(): string {
    let formatPattern: string = this.propertyStore.getFormatPattern();
    return formatPattern != null ? this.patternFormatService.javaToMoment(formatPattern) : null;
  }

  protected getDataMinWidth(): number {
    return this.fontService.getDataMinWidthTextBox(this);
  }

  protected getDataMaxWidth() {
    return this.fontService.getDataMaxWidthTextBox(this);
  }

  protected getDataMinHeight() {
    return this.fontService.getDataMinHeightTextBox(this);
  }

  protected getDataMaxHeight() {
    return this.fontService.getDataMaxHeightTextBox(this);
  }

  protected hasChangesLeave(): boolean {
    return this.hasChanges();
  }

  protected abstract hasChanges(): boolean;

  protected abstract getValueJson(): string;

  protected abstract setValueJson(value: string): void;

  public getJson(): any {
    if (!this.hasChanges()) {
      return null;
    }

    let controlJson: any = {
      meta: {
        name: this.getName()
      },
      data: {
        text: this.getValueJson()
      }
    };

    return controlJson;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (!dataJson) {
      return;
    }

    if (dataJson.text && dataJson.text.value !== undefined) {
      this.setValueJson(dataJson.text.value);
    }
  }

  public updateFittedWidth(): void {
    this.setFittedContentWidth(null);
  }

  protected onEnterCompleted(originalEvent: any, clientEvent: ClientEnterEvent): void {
    this.getComponent().onAfterEnter();
  }

  public hasOnValidatedEvent(): boolean {
    return (this.getEvents() & ControlEvent.OnValidated) ? true : false;
  }

  protected canExecuteValidated(originalEvent: any, clientEvent: ClientValidatedEvent): boolean {
    return this.hasOnValidatedEvent() && this.getIsEditable() && this.getVisibility() === ControlVisibility.Visible;
  }

  protected onValidatedExecuted(originalEvent: any, clientEvent: ClientValidatedEvent): void {
    // // Override in subclasses
  }

  protected onValidatedCompleted(originalEvent: any, clientEvent: ClientValidatedEvent): void {
    super.getOnLeaveSubscription(event)();
  }

  public hasOnLeaveEvent(): boolean {
    return super.hasOnLeaveEvent() || this.hasOnValidatedEvent();
  }

  protected getOnLeaveSubscription(event: any): () => void {
    return () => this.eventsService.fireValidated(
      this.getForm().getId(),
      this.getName(),
      event,
      new InternalEventCallbacks<ClientValidatedEvent>(
        this.canExecuteValidated.bind(this),
        this.onValidatedExecuted.bind(this),
        this.onValidatedCompleted.bind(this)
      )
    );
  }
}
