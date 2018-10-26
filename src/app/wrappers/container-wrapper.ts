import { ComponentRef, ViewContainerRef } from '@angular/core';

import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerComponent } from 'app/controls/container.component';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { ContainerLayout } from 'app/layout/container-layout/container-layout';
import { ButtonGroup } from 'app/wrappers/button-group/button-group';
import { VchControl } from 'app/vch/vch-control';
import { VchContainer } from 'app/vch/vch-container';
import { Visibility } from 'app/enums/visibility';
import { JsonUtil } from 'app/util/json-util';
import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';

export abstract class ContainerWrapper extends ControlWrapper implements ILayoutableContainerWrapper {

  protected controls: Array<ControlWrapper> = new Array<ControlWrapper>();

  private buttonGroup: ButtonGroup;

  public isLayoutableContainerWrapperInterface(): void {
    // Interface Marker
  }

  public getLayout(): LayoutContainerBase {
    return super.getLayout() as LayoutContainerBase;
  }

  protected createLayout(): LayoutBase {
    return new ContainerLayout(this);
  }

  public abstract getViewContainerRef(): ViewContainerRef;

  protected getComponentRef(): ComponentRef<ContainerComponent> {
    return super.getComponentRef() as ComponentRef<ContainerComponent>;
  }

  protected getComponent(): ContainerComponent {
    const compRef: ComponentRef<ContainerComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public updateComponentRecursively(): void {
    super.updateComponentRecursively();

    this.controls.forEach(controlWrp => {
      controlWrp.updateComponentRecursively();
    });
  }

  public getInvertFlowDirection(): boolean {
    return this.getPropertyStore().getInvertFlowDirection();
  }

  public getButtonGroup(): ButtonGroup {
    if (!this.supportsButtonGroup()) {
      return null;
    }

    if (!this.buttonGroup) {
      this.buttonGroup = new ButtonGroup(this.getName());
    }

    return this.buttonGroup;
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
    if (this.controls && this.controls.length) {
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
    if (this.controls && this.controls.length) {
      this.controls.forEach(control => {
        control.updateIsEditableParent();
      });
    }
  }

  public getJson(): any {
    if (!this.supportsButtonGroup()) {
      return null;
    }

    const dataJson: any = this.getButtonGroup().getDataJson();

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
        (controlWrp as ContainerWrapper).getControlsJson(controlsJson);
      }
    });
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);

    if (this.supportsButtonGroup() && dataJson) {
      this.getButtonGroup().setDataJson(dataJson);
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

  public findControl(name: string): ControlWrapper {
    for (const control of this.controls) {
      if (control.getName() === name) {
        return control;
      }
    }

    return null;
  }

  public findControlRecursive(name: string): ControlWrapper {
    let control: ControlWrapper = this.findControl(name);
    if (!control) {
      for (const subControl of this.controls) {
        if (subControl instanceof ContainerWrapper) {
          control = (subControl as ContainerWrapper).findControlRecursive(name);
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
      const controlJson: any = controlWrp.getState();

      if (!JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }

      if (controlWrp instanceof ContainerWrapper) {
        (controlWrp as ContainerWrapper).getControlsState(controlsJson);
      }
    });
  }

  public canReceiveKeyboardFocus(): boolean {
    return false;
  }

  public setFocus(): void {
    const focusableControl: ILayoutableControlWrapper = this.getFocusService().findFirstFocusableControlInContainerRecursive(this);

    if (focusableControl) {
      focusableControl.setFocus();
    }
  }
}
