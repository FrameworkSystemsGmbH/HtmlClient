import { ComponentFactoryResolver } from '@angular/core';

import { IControlsService } from 'app/services/controls.service';
import { IEventsService } from 'app/services/events.service';
import { IFocusService } from 'app/services/focus.service';
import { IFontService } from 'app/services/font.service';
import { IPatternFormatService } from 'app/services/formatter/pattern-format.service';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FittedDataWrapper } from 'app/wrappers/fitted-data-wrapper';
import { PropertyData } from 'app/common/property-data';
import { TextAlign } from 'app/enums/text-align';
import { TextFormat } from 'app/enums/text-format';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientValidatedEvent } from 'app/common/events/client-validated-event';
import { ControlEvent } from 'app/enums/control-event';
import { ControlVisibility } from 'app/enums/control-visibility';

export abstract class TextBoxBaseWrapper extends FittedDataWrapper {

  private readonly patternFormatService: IPatternFormatService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    controlsService: IControlsService,
    eventsService: IEventsService,
    focusService: IFocusService,
    fontService: IFontService,
    patternFormatService: IPatternFormatService
  ) {
    super(form, parent, controlStyle, resolver, controlsService, eventsService, focusService, fontService);
    this.patternFormatService = patternFormatService;
  }

  protected getComponent(): TextBoxComponent {
    return super.getComponent() as TextBoxComponent;
  }

  public getDisabledBackColor(): string {
    const disabledBackColor: string = this.getPropertyStore().getDisabledBackColor();
    return disabledBackColor != null ? disabledBackColor : '#CCCCCC';
  }

  public getCaption(): string {
    const caption: string = this.getPropertyStore().getCaption();
    return caption != null ? caption : null;
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign = this.getPropertyStore().getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Left;
  }

  public getMaxScale(): number {
    const maxScale: number = this.getPropertyStore().getMaxScale();
    return maxScale != null ? maxScale : 2;
  }

  public getMaxPrec(): number {
    const maxPrec: number = this.getPropertyStore().getMaxPrec();
    return maxPrec != null ? maxPrec : 18;
  }

  public getFormat(): TextFormat {
    const textFormat: TextFormat = this.getPropertyStore().getFormat();
    return textFormat != null ? textFormat : TextFormat.None;
  }

  public getFormatPattern(): string {
    const formatPattern: string = this.getPropertyStore().getFormatPattern();
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

    const controlJson: any = {
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
    return () => this.getEventsService().fireValidated(
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
