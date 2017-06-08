import { ComponentRef, ViewContainerRef, Injector } from '@angular/core';

import { BaseWrapper, FormWrapper } from '.';
import { BaseComponent, ContainerComponent } from '../controls';
import { LayoutControl, LayoutContainer } from '../layout';
import { JsonUtil } from '../util';
import { VchContainer, VchManager } from '../vch';
import { ResponseControlDto } from '../communication/response';
import { EventsService } from '../services/events.service';
import { ControlStyleService } from '../services/control-style.service';
import { ControlsService } from '../services/controls.service';

export abstract class ContainerWrapper extends BaseWrapper implements LayoutContainer {

  protected controls: Array<BaseWrapper>;
  protected controlsService: ControlsService;

  constructor(
    json: any,
    form: FormWrapper,
    parent: ContainerWrapper,
    appInjector: Injector
  ) {
    super(json, form, parent, appInjector);
    this.controlsService = appInjector.get(ControlsService);
    this.vchControl = new VchContainer(this);
    this.controls = new Array<BaseWrapper>();
  }

  public abstract getViewContainerRef(): ViewContainerRef;

  protected getComponentRef(): ComponentRef<ContainerComponent> {
    return <ComponentRef<ContainerComponent>>super.getComponentRef();
  }

  protected getComponent(): ContainerComponent {
    return this.getComponentRef().instance;
  }

  public getInvertFlowDirection(): boolean {
    return false;
  }

  public getVchContainer(): VchContainer {
    return <VchContainer>this.getVchControl();
  }

  public getLayoutableControls(): Array<LayoutControl> {
    return this.getVchContainer().getChildrenInFlowDirection();
  }

  public removeChild(child: LayoutControl): void {

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

  public setJson(json: any, delta: boolean): void {
    super.setJson(json, delta);

    if (json.controls && json.controls.length) {
      this.setControlsJson(json.controls, delta);
    }
  }

  protected setControlsJson(controlsJson: any, delta: boolean): void {
    if (!controlsJson || !controlsJson.length) {
      return;
    }

    controlsJson.forEach((controlJson: any) => {
      if (delta) {
        let controlName: string = controlJson.name;
        let controlWrps: Array<BaseWrapper> = this.controls.filter((controlWrp: BaseWrapper) => controlWrp.getName() === controlName);

        if (controlWrps && controlWrps.length) {
          let control: BaseWrapper = controlWrps[0];
          control.setJson(controlJson, true);
        }
      } else {
        let control: BaseWrapper = this.controlsService.createWrapperFromString(controlJson.type, controlJson, this.getForm(), this);
        this.controls.push(control);
      }
    });
  }

  public attachComponent(container: ContainerWrapper): void {
    super.attachComponent(container);
    VchManager.add(this);
  }

  public updateComponent(): void {

  }

  public findControl(id: string): BaseWrapper {
    for (let i: number = 0; i < this.controls.length; i++) {
      let control: BaseWrapper = this.controls[i];
      if (control.getId() === id) {
        return control;
      }
    }

    return null;
  }

  public findControlRecursive(id: string): BaseWrapper {
    let control: BaseWrapper = this.findControl(id);

    if (!control) {
      for (let i: number = 0; i < this.controls.length; i++) {
        let subControl: BaseWrapper = this.controls[i];
        if (subControl instanceof ContainerWrapper) {
          control = (<ContainerWrapper>subControl).findControlRecursive(id);
          if (control) {
            return control;
          }
        }
      }
    }

    return control;
  }

}
