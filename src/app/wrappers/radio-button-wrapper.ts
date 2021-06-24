import { ComponentFactory, ComponentRef } from '@angular/core';
import { ClientClickEvent } from '@app/common/events/client-click-event';
import { InternalEventCallbacks } from '@app/common/events/internal/internal-event-callbacks';
import { RadioButtonComponent } from '@app/controls/radio-button/radio-button.component';
import { ClientEventType } from '@app/enums/client-event-type';
import { ControlType } from '@app/enums/control-type';
import { Visibility } from '@app/enums/visibility';
import { ButtonGroup } from '@app/wrappers/button-group/button-group';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { Subscription } from 'rxjs';

export class RadioButtonWrapper extends FittedWrapper {

  private radioClickSub: Subscription;
  private onValueChangedSub: Subscription;

  private value: string;

  public getControlType(): ControlType {
    return ControlType.RadioButton;
  }

  public fireValueChanged(): void {
    const buttonGroup: ButtonGroup = this.getButtonGroup();

    if (buttonGroup) {
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

  public getValue(): string {
    return this.value;
  }

  public getCheckedValue(): string {
    return this.getPropertyStore().getDatasourceOnValue();
  }

  public getButtonGroupName(): string {
    const buttonGroup: ButtonGroup = this.getButtonGroup();
    return buttonGroup ? buttonGroup.getGroupName() : null;
  }

  private getButtonGroup(): ButtonGroup {
    return this.getButtonGroupRecursively(this.getParent());
  }

  private getButtonGroupRecursively(parent: ContainerWrapper): ButtonGroup {
    if (!parent) {
      return null;
    }

    if (parent.supportsButtonGroup()) {
      return parent.getButtonGroup();
    }

    return this.getButtonGroupRecursively(parent.getParent());
  }

  private onButtonGroupValueChanged(value: string): void {
    this.value = value;
    this.updateComponent();
  }

  protected getComponentRef(): ComponentRef<RadioButtonComponent> {
    return super.getComponentRef() as ComponentRef<RadioButtonComponent>;
  }

  protected getComponent(): RadioButtonComponent {
    const compRef: ComponentRef<RadioButtonComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<RadioButtonComponent> {
    const factory: ComponentFactory<RadioButtonComponent> = this.getResolver().resolveComponentFactory(RadioButtonComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  protected attachEvents(instance: RadioButtonComponent): void {
    super.attachEvents(instance);

    if (this.hasOnClickEvent()) {
      this.radioClickSub = instance.radioClick.subscribe(() => this.getRadioClickSubscription()());
    }

    const buttonGroup: ButtonGroup = this.getButtonGroup();

    if (buttonGroup) {
      this.onValueChangedSub = buttonGroup.onValueChanged().subscribe(value => this.onButtonGroupValueChanged(value));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.radioClickSub) {
      this.radioClickSub.unsubscribe();
    }

    if (this.onValueChangedSub) {
      this.onValueChangedSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) === ClientEventType.OnClick;
  }

  protected getRadioClickSubscription(): () => void {
    return () => this.getEventsService().fireClick(
      this.getForm().getId(),
      this.getName(),
      new InternalEventCallbacks<ClientClickEvent>(
        this.canExecuteRadioClick.bind(this),
        this.radioClickExecuted.bind(this),
        this.radioClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteRadioClick(clientEvent: ClientClickEvent, payload: any): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected radioClickExecuted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  protected radioClickCompleted(clientEvent: ClientClickEvent, payload: any, processedEvent: any): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    const caption: string = this.getCaption();

    if (!String.isNullOrEmpty(caption)) {
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
    stateJson.value = this.value;
    return stateJson;
  }

  public loadState(json: any): void {
    super.loadState(json);
    this.value = json.value;
  }

  public canReceiveKeyboardFocus(): boolean {
    return super.canReceiveKeyboardFocus() && this.getCheckedValue() !== this.getValue();
  }
}
