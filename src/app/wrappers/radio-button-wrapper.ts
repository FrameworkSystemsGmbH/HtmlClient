import { ComponentFactory, ComponentRef } from '@angular/core';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { RadioButtonComponent } from '@app/controls/radio-button/radio-button.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { Visibility } from '@app/enums/visibility';
import { ButtonGroup } from '@app/wrappers/button-group/button-group';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { Subscription } from 'rxjs';

export class RadioButtonWrapper extends FittedWrapper {

  private _radioClickSub: Subscription | null = null;
  private _onValueChangedSub: Subscription | null = null;

  private _value: string | null = null;

  public getControlType(): ControlType {
    return ControlType.RadioButton;
  }

  public fireValueChanged(): void {
    const buttonGroup: ButtonGroup | null = this.getButtonGroup();

    if (buttonGroup != null) {
      buttonGroup.fireValueChanged(this.getCheckedValue());
    }
  }

  public providesControlLabelWrapper(): boolean {
    return false;
  }

  // Width of the button
  public getButtonWidth(): number {
    return 18;
  }

  // Height of the button
  public getButtonHeight(): number {
    return 18;
  }

  // Width of the gap between the radio button an the label
  public getLabelGap(): number {
    return 3;
  }

  public getValue(): string | null {
    return this._value;
  }

  public getCheckedValue(): string | null {
    const checkedValue: string | undefined = this.getPropertyStore().getDatasourceOnValue();
    return checkedValue != null ? checkedValue : null;
  }

  public getButtonGroupName(): string | null {
    const buttonGroup: ButtonGroup | null = this.getButtonGroup();
    return buttonGroup ? buttonGroup.getGroupName() : null;
  }

  private getButtonGroup(): ButtonGroup | null {
    return this.getButtonGroupRecursively(this.getParent());
  }

  private getButtonGroupRecursively(parent: ContainerWrapper | null): ButtonGroup | null {
    if (!parent) {
      return null;
    }

    if (parent.supportsButtonGroup()) {
      return parent.getButtonGroup();
    }

    return this.getButtonGroupRecursively(parent.getParent());
  }

  private onButtonGroupValueChanged(value: string | null): void {
    this._value = value;
    this.updateComponent();
  }

  protected getComponentRef(): ComponentRef<RadioButtonComponent> | null {
    return super.getComponentRef() as ComponentRef<RadioButtonComponent> | null;
  }

  protected getComponent(): RadioButtonComponent | null {
    const compRef: ComponentRef<RadioButtonComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<RadioButtonComponent> {
    const factory: ComponentFactory<RadioButtonComponent> = this.getResolver().resolveComponentFactory(RadioButtonComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: RadioButtonComponent): void {
    super.attachEvents(instance);

    if (this.hasOnClickEvent()) {
      this._radioClickSub = instance.radioClick.subscribe(() => this.getRadioClickSubscription()());
    }

    const buttonGroup: ButtonGroup | null = this.getButtonGroup();

    if (buttonGroup != null) {
      this._onValueChangedSub = buttonGroup.onValueChanged().subscribe(value => this.onButtonGroupValueChanged(value));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this._radioClickSub) {
      this._radioClickSub.unsubscribe();
    }

    if (this._onValueChangedSub) {
      this._onValueChangedSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) === ClientEventType.OnClick;
  }

  protected getRadioClickSubscription(): () => void {
    return (): void => {
      const form: FormWrapper | null = this.getForm();
      if (form != null) {
        this.getEventsService().fireClick(
          form.getId(),
          this.getName(),
          new InternalEventCallbacks(
            this.canExecuteRadioClick.bind(this),
            this.radioClickExecuted.bind(this),
            this.radioClickCompleted.bind(this)
          )
        );
      }
    };
  }

  protected canExecuteRadioClick(payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected radioClickExecuted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected radioClickCompleted(payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    const caption: string | null = this.getCaption();

    if (caption != null && caption.trim().length > 0) {
      this.setFittedContentWidth(this.getFontService().measureTextWidth(caption, this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getButtonWidth() + this.getLabelGap());
    } else {
      this.setFittedContentWidth(this.getButtonWidth());
    }
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(Math.max(this.getFontService().measureTextHeight(this.getFontFamily(), this.getFontSize()), this.getButtonHeight()));
  }

  public saveState(): any {
    const stateJson: any = super.saveState();
    stateJson.value = this._value;
    return stateJson;
  }

  public loadState(json: any): void {
    super.loadState(json);
    this._value = json.value;
  }

  public canReceiveKeyboardFocus(): boolean {
    return super.canReceiveKeyboardFocus() && this.getCheckedValue() !== this.getValue();
  }
}
