import { ComponentRef, ViewContainerRef, Injector } from '@angular/core';

import { BaseWrapper, FormWrapper } from '.';
import { BaseComponent, ContainerComponent } from '../controls';
import { LayoutableControl, LayoutableContainer, LayoutContainerBase, LayoutBase } from '../layout';
import { JsonUtil } from '../util';
import { VchContainer } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';
import { ControlsService } from '../services/controls.service';
import { ContainerLayout } from '../layout/container-layout';

export abstract class ContainerWrapper extends BaseWrapper implements LayoutableContainer {

  protected controls: Array<BaseWrapper>;
  protected controlsService: ControlsService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector
  ) {
    super(form, parent, appInjector);
    this.controlsService = appInjector.get(ControlsService);
    this.vchControl = new VchContainer(this);
    this.controls = new Array<BaseWrapper>();
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
    return this.getComponentRef().instance;
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

  // public getDto(): any {
  //   let controlsJson: any = [];

  //   this.controls.forEach((controlWrp: BaseWrapper) => {
  //     let controlJson: any = controlWrp.getJson();

  //     if (controlJson && !JsonUtil.isEmptyObject(controlJson)) {
  //       controlsJson.push(controlJson);
  //     }
  //   });

  //   if (!JsonUtil.isEmptyObject(controlsJson)) {
  //     let containerJson: any = {
  //       meta: {
  //         name: this.getName()
  //       },
  //       controls: controlsJson
  //     };

  //     return containerJson;
  //   }

  //   return null;
  // }

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
