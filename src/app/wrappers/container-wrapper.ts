import { ComponentRef, ViewContainerRef, Injector } from '@angular/core';

import { BaseWrapper } from './base-wrapper';
import { FormWrapper } from './form-wrapper';
import { ContainerComponent } from '../controls/container.component';
import { LayoutableControl, LayoutableContainer, LayoutContainerBase, LayoutBase } from '../layout';
import { JsonUtil } from '../util';
import { VchContainer } from '../vch/vch-container';
import { ControlsService } from '../services/controls.service';
import { ContainerLayout } from '../layout/container-layout';
import { PropertyData } from '../common';

export abstract class ContainerWrapper extends BaseWrapper implements LayoutableContainer {

  protected controls: Array<BaseWrapper>;
  protected controlsService: ControlsService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    injector: Injector
  ) {
    super(form, parent, controlStyle, injector);
    this.vchControl = new VchContainer(this);
    this.controls = new Array<BaseWrapper>();
    this.controlsService = injector.get(ControlsService);
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
    let compRef: ComponentRef<ContainerComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getInvertFlowDirection(): boolean {
    return this.propertyStore.getInvertFlowDirection();
  }

  public getVchContainer(): VchContainer {
    return <VchContainer>this.getVchControl();
  }

  public getLayoutableControls(): Array<LayoutableControl> {
    return this.getVchContainer().getChildrenInFlowDirection();
  }

  public addControl(control: BaseWrapper): void {
    this.controls.push(control);
  }

  public removeChild(child: LayoutableControl): void {

  }

  public resumeVch(): void {
    // Noop
  }

  public getControlsJson(controlsJson: Array<any>): void {
    this.controls.forEach((controlWrp: BaseWrapper) => {
      let controlJson: any = controlWrp.getJson();

      if (controlJson && !JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }

      if (controlWrp instanceof ContainerWrapper) {
        (<ContainerWrapper>controlWrp).getControlsJson(controlsJson);
      }
    });
  }

  public attachComponent(container: ContainerWrapper): void {
    super.attachComponent(container);

    for (let child of this.controls) {
      child.attachComponent(this);
    }
  }

  public findControl(name: string): BaseWrapper {
    for (let i: number = 0; i < this.controls.length; i++) {
      let control: BaseWrapper = this.controls[i];
      if (control.getName() === name) {
        return control;
      }
    }

    return null;
  }

  public findControlRecursive(name: string): BaseWrapper {
    let control: BaseWrapper = this.findControl(name);
    if (!control) {
      for (let i: number = 0; i < this.controls.length; i++) {
        let subControl: BaseWrapper = this.controls[i];
        if (subControl instanceof ContainerWrapper) {
          control = (<ContainerWrapper>subControl).findControlRecursive(name);
          if (control) {
            return control;
          }
        }
      }
    }

    return control;
  }

}
