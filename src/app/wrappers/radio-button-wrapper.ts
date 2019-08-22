import { ComponentRef, ComponentFactory } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { RadioButtonComponent } from 'app/controls/radio-button/radio-button.component';
import { ButtonGroup } from 'app/wrappers/button-group/button-group';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { FittedWrapper } from 'app/wrappers/fitted-wrapper';
import { ControlType } from 'app/enums/control-type';
import { ClientClickEvent } from 'app/common/events/client-click-event';
import { InternalEventCallbacks } from 'app/common/events/internal/internal-event-callbacks';
import { ClientEventType } from 'app/enums/client-event-type';
import { Visibility } from 'app/enums/visibility';

export class RadioButtonWrapper extends FittedWrapper {

  private onClickSub: Subscription;
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

    if (this.getEvents() & ClientEventType.OnClick) {
      this.onClickSub = instance.onClick.subscribe(event => this.getOnClickSubscription(event)());
    }

    const buttonGroup: ButtonGroup = this.getButtonGroup();

    if (buttonGroup) {
      this.onValueChangedSub = buttonGroup.onValueChanged().subscribe(value => this.onButtonGroupValueChanged(value));
    }
  }

  protected detachEvents(): void {
    super.detachEvents();

    if (this.onClickSub) {
      this.onClickSub.unsubscribe();
    }

    if (this.onValueChangedSub) {
      this.onValueChangedSub.unsubscribe();
    }
  }

  public hasOnClickEvent(): boolean {
    return (this.getEvents() & ClientEventType.OnClick) ? true : false;
  }

  protected getOnClickSubscription(event: any): () => void {
    return () => this.getEventsService().fireClick(
      this.getForm().getId(),
      this.getName(),
      event,
      new InternalEventCallbacks<ClientClickEvent>(
        this.canExecuteClick.bind(this),
        this.onClickExecuted.bind(this),
        this.onClickCompleted.bind(this)
      )
    );
  }

  protected canExecuteClick(originalEvent: any, clientEvent: ClientClickEvent): boolean {
    return this.getCurrentIsEditable() && this.getCurrentVisibility() === Visibility.Visible;
  }

  protected onClickExecuted(originalEvent: any, clientEvent: ClientClickEvent): void {
    // Override in subclasses
  }

  protected onClickCompleted(originalEvent: any, clientEvent: ClientClickEvent): void {
    // Override in subclasses
  }

  public updateFittedWidth(): void {
    const caption: string = this.getCaption();

    if (!!caption) {
      this.setFittedContentWidth(this.getFontService().measureText(caption, this.getFontFamily(), this.getFontSize(), this.getFontBold(), this.getFontItalic()) + this.getButtonWidth() + this.getLabelGap());
    } else {
      this.setFittedContentWidth(this.getButtonWidth());
    }
  }

  public updateFittedHeight(): void {
    this.setFittedContentHeight(Math.max(this.getFontSize(), this.getButtonHeight()));
  }

  public getState(): any {
    const stateJson: any = super.getState();
    stateJson.value = this.value;
    return stateJson;
  }

  public setState(json: any): void {
    super.setState(json);
    this.value = json.value;
  }

  public canReceiveKeyboardFocus(): boolean {
    return super.canReceiveKeyboardFocus() && this.getCheckedValue() !== this.getValue();
  }
}
