import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { Visibility } from '@app/enums/visibility';
import { ContainerLayout } from '@app/layout/container-layout/container-layout';
import { LayoutBase } from '@app/layout/layout-base';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import * as InterfaceUtil from '@app/util/interface-util';
import * as JsonUtil from '@app/util/json-util';
import { VchContainer } from '@app/vch/vch-container';
import { VchControl } from '@app/vch/vch-control';
import { ButtonGroup } from '@app/wrappers/button-group/button-group';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export abstract class ContainerWrapper extends ControlWrapper implements ILayoutableContainerWrapper {

  protected controls: Array<ControlWrapper> = new Array<ControlWrapper>();

  private _buttonGroup: ButtonGroup | null = null;

  protected init(): void {
    this.controls = new Array<ControlWrapper>();
  }

  public isILayoutableContainer(): void {
    // Interface Marker
  }

  public isILayoutableContainerWrapper(): void {
    // Interface Marker
  }

  public getLayout(): LayoutContainerBase {
    return super.getLayout() as LayoutContainerBase;
  }

  protected createLayout(): LayoutBase {
    return new ContainerLayout(this);
  }

  protected getComponentRef(): ComponentRef<ContainerComponent> | null {
    return super.getComponentRef() as ComponentRef<ContainerComponent> | null;
  }

  protected getComponent(): ContainerComponent | null {
    const compRef: ComponentRef<ContainerComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public updateComponentRecursively(): void {
    super.updateComponentRecursively();

    this.controls.forEach(controlWrp => {
      controlWrp.updateComponentRecursively();
    });
  }

  public getInvertFlowDirection(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getInvertFlowDirection());
  }

  public getButtonGroup(): ButtonGroup | null {
    if (!this.supportsButtonGroup()) {
      return null;
    }

    if (!this._buttonGroup) {
      this._buttonGroup = new ButtonGroup(this.getName());
    }

    return this._buttonGroup;
  }

  public supportsButtonGroup(): boolean {
    return false;
  }

  protected createVchControl(): VchControl {
    return new VchContainer(this);
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this.getVchContainer().getChildren();
  }

  public addChild(control: ControlWrapper): void {
    this.controls.push(control);
  }

  public setVisibilityAction(value: Visibility): void {
    super.setVisibilityAction(value);
    this.updateVisibilityParent();
  }

  public updateVisibilityParent(): void {
    super.updateVisibilityParent();
    if (this.controls.length > 0) {
      this.controls.forEach(control => {
        control.updateVisibilityParent();
      });
    }
  }

  public setIsEditableAction(value: boolean): void {
    super.setIsEditableAction(value);
    this.updateIsEditableParent();
  }

  public updateIsEditableParent(): void {
    super.updateIsEditableParent();
    if (this.controls.length > 0) {
      this.controls.forEach(control => {
        control.updateIsEditableParent();
      });
    }
  }

  public getJson(): any {
    if (!this.supportsButtonGroup()) {
      return null;
    }

    const buttonGroup: ButtonGroup | null = this.getButtonGroup();

    const dataJson: any = buttonGroup ? buttonGroup.getDataJson() : null;

    if (JsonUtil.isEmptyObject(dataJson)) {
      return null;
    }

    const controlJson: any = {
      meta: {
        name: this.getName()
      },
      data: dataJson
    };

    return controlJson;
  }

  public getControlsJson(controlsJson: Array<any>): void {
    this.controls.forEach((controlWrp: ControlWrapper) => {
      const controlJson: any = controlWrp.getJson();

      if (controlJson && !JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }

      if (controlWrp instanceof ContainerWrapper) {
        controlWrp.getControlsJson(controlsJson);
      }
    });
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (this.supportsButtonGroup() && dataJson) {
      const buttonGroup: ButtonGroup | null = this.getButtonGroup();
      if (buttonGroup != null) {
        buttonGroup.setDataJson(dataJson);
      }
    }
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    super.attachComponent(uiContainer, vchContainer);

    // Attach children to UI and VCH
    this.attachSubComponents(this, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    for (const child of this.controls) {
      child.attachComponent(uiContainer, vchContainer);
    }
  }

  public findControl(name: string): ControlWrapper | null {
    for (const control of this.controls) {
      if (control.getName() === name) {
        return control;
      }
    }

    return null;
  }

  public findControlRecursive(name: string): ControlWrapper | null {
    let control: ControlWrapper | null = this.findControl(name);
    if (!control) {
      for (const subControl of this.controls) {
        if (subControl instanceof ContainerWrapper) {
          control = subControl.findControlRecursive(name);
          if (control) {
            return control;
          }
        }
      }
    }

    return control;
  }

  public getControlsState(controlsJson: Array<any>): void {
    this.controls.forEach((controlWrp: ControlWrapper) => {
      const controlJson: any = controlWrp.saveState();

      if (!JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }

      if (controlWrp instanceof ContainerWrapper) {
        controlWrp.getControlsState(controlsJson);
      }
    });
  }

  public canReceiveKeyboardFocus(): boolean {
    return false;
  }

  public setFocus(): void {
    const focusableControl: ILayoutableControlWrapper | null = this.findFirstFocusableControlInContainerRecursive();

    if (focusableControl) {
      focusableControl.setFocus();
    }
  }

  public findFirstFocusableControlInContainerRecursive(): ILayoutableControlWrapper | null {
    if (!this.canReceiveFocus()) {
      return null;
    }

    const children: Array<ILayoutableControlWrapper> = this.getVchContainer().getChildren();

    for (const child of children) {
      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = child.findFirstFocusableControlInContainerRecursive();

        if (containerChild) {
          return containerChild;
        }
      }

      if (child.canReceiveFocus()) {
        return child;
      }
    }

    return null;
  }

  public findPreviousKeyboardFocusableControlRecursive(): ILayoutableControlWrapper | null {
    const children: Array<ILayoutableControlWrapper> = this.getVchContainer().getChildren();

    for (let i = children.length - 1; i >= 0; i--) {
      const child: ILayoutableControlWrapper = children[i];

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = child.findPreviousKeyboardFocusableControlRecursive();

        if (containerChild) {
          return containerChild;
        }
      }

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }
    }

    if (this.canReceiveKeyboardFocus()) {
      return this;
    }

    return null;
  }

  public findNextKeyboardFocusableControlRecursive(): ILayoutableControlWrapper | null {
    if (this.canReceiveKeyboardFocus()) {
      return this;
    }

    const children: Array<ILayoutableControlWrapper> = this.getVchContainer().getChildren();

    for (const child of children) {
      if (child.canReceiveKeyboardFocus()) {
        return child;
      }

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = child.findNextKeyboardFocusableControlRecursive();

        if (containerChild) {
          return containerChild;
        }
      }
    }

    return null;
  }

  public abstract getViewContainerRef(): ViewContainerRef;
}
