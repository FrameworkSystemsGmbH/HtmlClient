import { ComponentRef, ViewContainerRef } from '@angular/core';

import { BaseWrapper, FormWrapper } from '.';
import { BaseComponent, ContainerComponent } from '../controls';
import { LayoutableControl, LayoutableContainer } from '../layout';
import { ControlsService, EventsService } from '../services';
import { JsonUtil } from '../util';
import { VchContainer } from '../vch';

export abstract class ContainerWrapper extends BaseWrapper implements LayoutableContainer {

  protected controls: Array<BaseWrapper>;
  protected controlsService: ControlsService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlJson: any,
    eventsService: EventsService,
    controlsService: ControlsService
  ) {
    super(form, parent, eventsService, controlJson);
    this.controlsService = controlsService;
  }

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

  public getLayoutableControls(): Array<LayoutableControl> {
    return this.getVchContainer().getChildrenInFlowDirection();
  }

  public removeChild(child: LayoutableControl): void {

  }

  public resumeVch(): void {
    // Noop
  }

  protected initialize(controlJson: any): void {
    super.initialize(controlJson);
    this.controls = new Array<BaseWrapper>();
  }

  public getJson(): any {
    let controlsJson: any = [];

    this.controls.forEach((controlWrp: BaseWrapper) => {
      let controlJson: any = controlWrp.getJson();

      if (controlJson && !JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }
    });

    if (!JsonUtil.isEmptyObject(controlsJson)) {
      let containerJson: any = {
        meta: {
          name: this.getName()
        },
        controls: controlsJson
      };

      return containerJson;
    }

    return null;
  }

  public setJson(controlJson: any, delta: boolean): void {
    super.setJson(controlJson, delta);

    if (controlJson.controls && controlJson.controls.length) {
      this.setControlsJson(controlJson.controls, delta);
    }
  }

  protected setControlsJson(controlsJson: any, delta: boolean): void {
    if (!controlsJson || !controlsJson.length) {
      return;
    }

    controlsJson.forEach((controlJson: any) => {
      if (delta) {
        let controlName: string = controlJson.meta.name;
        let controlWrps: Array<BaseWrapper> = this.controls.filter((controlWrp: BaseWrapper) => controlWrp.getName() === controlName);

        if (controlWrps && controlWrps.length) {
          let control: BaseWrapper = controlWrps[0];
          control.setJson(controlJson, true);
        }
      } else {
        let control: BaseWrapper = this.controlsService.createWrapperFromString(controlJson.meta.type, this.getForm(), this, controlJson);
        this.controls.push(control);
      }
    });
  }

  public addComponentToView(): void {
    super.addComponentToView();

    this.controls.forEach((wrapper: BaseWrapper) => {
      wrapper.addComponentToView();
    });
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
