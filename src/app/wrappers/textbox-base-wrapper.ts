import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { TextAlign } from '@app/enums/text-align';
import { TextFormat } from '@app/enums/text-format';
import { TextBoxType } from '@app/enums/textbox-type';
import { Visibility } from '@app/enums/visibility';
import { FittedDataWrapper } from '@app/wrappers/fitted-data-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';

export abstract class TextBoxBaseWrapper extends FittedDataWrapper {

  public getControlType(): ControlType {
    return ControlType.TextBox;
  }

  protected getComponent(): TextBoxComponent | null {
    return super.getComponent() as TextBoxComponent | null;
  }

  public getDisabledBackColor(): string {
    const disabledBackColor: string | undefined = this.getPropertyStore().getDisabledBackColor();
    return disabledBackColor ?? '#CCCCCC';
  }

  public getCaption(): string | null {
    const caption: string | undefined = this.getPropertyStore().getCaption();
    return caption ?? null;
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign | undefined = this.getPropertyStore().getTextAlign();
    return textAlign ?? TextAlign.Left;
  }

  public getMaxScale(): number {
    const maxScale: number | undefined = this.getPropertyStore().getMaxScale();
    return maxScale ?? 2;
  }

  public getMaxPrec(): number {
    const maxPrec: number | undefined = this.getPropertyStore().getMaxPrec();
    return maxPrec ?? 18;
  }

  public getFormat(): TextFormat {
    const textFormat: TextFormat | undefined = this.getPropertyStore().getFormat();
    return textFormat ?? TextFormat.None;
  }

  public getFormatPattern(): string | null {
    const formatPattern: string | undefined = this.getPropertyStore().getFormatPattern();
    return formatPattern != null ? this.getPatternFormatService().javaToMoment(formatPattern) : null;
  }

  protected getDataMinWidth(): number {
    return this.getFontService().getDataMinWidthTextBox(this);
  }

  protected getDataMaxWidth(): number {
    return this.getFontService().getDataMaxWidthTextBox(this);
  }

  protected getDataMinHeight(): number {
    return this.getFontService().getDataMinHeightTextBox(this);
  }

  protected getDataMaxHeight(): number {
    return this.getFontService().getDataMaxHeightTextBox(this);
  }

  protected hasChangesLeave(): boolean {
    return this.hasChanges();
  }

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

  protected ctrlEnterCompleted(payload: any, processedEvent: any): void {
    const comp: TextBoxComponent | null = this.getComponent();
    if (comp != null) {
      comp.onAfterEnter();
    }
  }

  public hasOnValidatedEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnValidated) === ClientEventType.OnValidated.valueOf();
  }

  protected canExecuteValidated(payload: any): boolean {
    return this.hasOnValidatedEvent() && this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible && this.hasChanges();
  }

  protected onValidatedExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected onValidatedCompleted(payload: any, processedEvent: any): void {
    super.getCtrlLeaveSubscription()();
  }

  public hasOnLeaveEvent(): boolean {
    return super.hasOnLeaveEvent() || this.hasOnValidatedEvent();
  }

  protected getCtrlLeaveSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireValidated(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteValidated.bind(this),
            this.onValidatedExecuted.bind(this),
            this.onValidatedCompleted.bind(this)
          )
        );
      }
    };
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.value = this.getValueJson();
    json.textBoxType = this.getTextBoxType();
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);

    if (json.value) {
      this.setValueJson(json.value);
    }
  }

  public isOutlineVisible(isFocused: boolean): boolean {
    return isFocused;
  }

  public abstract getTextBoxType(): TextBoxType;

  protected abstract hasChanges(): boolean;

  protected abstract getValueJson(): string;

  protected abstract setValueJson(value: string | null): void;
}
