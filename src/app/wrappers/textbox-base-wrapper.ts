import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { TextBoxComponent } from 'app/controls/textboxes/textbox.component';
import { FittedDataWrapper } from 'app/wrappers/fitted-data-wrapper';
import { TextAlign } from 'app/enums/text-align';
import { TextFormat } from 'app/enums/text-format';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEnterEvent } from 'app/common/events/client-enter-event';
import { ClientValidatedEvent } from 'app/common/events/client-validated-event';
import { ClientEventType } from 'app/enums/client-event-type';
import { Visibility } from 'app/enums/visibility';
import { TextBoxType } from 'app/enums/textbox-type';
import { ControlType } from 'app/enums/control-type';

export abstract class TextBoxBaseWrapper extends FittedDataWrapper {

  private patternFormatService: PatternFormatService;

  protected init(): void {
    super.init();
    this.patternFormatService = this.getInjector().get(PatternFormatService);
  }

  public abstract getTextBoxType(): TextBoxType;

  public getControlType(): ControlType {
    return ControlType.TextBox;
  }

  protected getPatternFormatService(): PatternFormatService {
    return this.patternFormatService;
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
    return this.getFontService().getDataMinWidthTextBox(this);
  }

  protected getDataMaxWidth() {
    return this.getFontService().getDataMaxWidthTextBox(this);
  }

  protected getDataMinHeight() {
    return this.getFontService().getDataMinHeightTextBox(this);
  }

  protected getDataMaxHeight() {
    return this.getFontService().getDataMaxHeightTextBox(this);
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

  protected onEnterCompleted(clientEvent: ClientEnterEvent, payload: any, processedEvent: any): void {
    this.getComponent().onAfterEnter();
  }

  public hasOnValidatedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnValidated) ? true : false;
  }

  protected canExecuteValidated(clientEvent: ClientValidatedEvent, payload: any): boolean {
    return this.hasOnValidatedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onValidatedExecuted(clientEvent: ClientValidatedEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onValidatedCompleted(clientEvent: ClientValidatedEvent, payload: any, processedEvent: any): void {
    super.getOnLeaveSubscription()();
  }

  public hasOnLeaveEvent(): boolean {
    return super.hasOnLeaveEvent() || this.hasOnValidatedEvent();
  }

  protected getOnLeaveSubscription(): () => void {
    return () => this.getEventsService().fireValidated(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientValidatedEvent>(
        this.canExecuteValidated.bind(this),
        this.onValidatedExecuted.bind(this),
        this.onValidatedCompleted.bind(this)
      )
    );
  }

  public getState(): any {
    const json: any = super.getState();
    json.value = this.getValueJson();
    json.textBoxType = this.getTextBoxType();
    return json;
  }

  protected setState(json: any): void {
    super.setState(json);

    if (json.value) {
      this.setValueJson(json.value);
    }
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused;
  }
}
