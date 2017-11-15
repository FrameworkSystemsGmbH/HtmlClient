import { ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IControlsService } from 'app/services/controls.service';
import { IEventsService } from 'app/services/events.service';
import { IFocusService } from 'app/services/focus.service';

import { ContainerComponent } from 'app/controls/container.component';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { LayoutBase } from 'app/layout/layout-base';
import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { ContainerLayout } from 'app/layout/container-layout/container-layout';
import { VchContainer } from 'app/vch/vch-container';
import { PropertyData } from 'app/common/property-data';
import { JsonUtil } from 'app/util/json-util';

export abstract class ContainerWrapper extends ControlWrapper implements ILayoutableContainerWrapper {

  protected controls: Array<ControlWrapper>;
  protected controlsService: IControlsService;

  constructor(
    form: FormWrapper,
    parent: ContainerWrapper,
    controlStyle: PropertyData,
    resolver: ComponentFactoryResolver,
    eventsService: IEventsService,
    focusService: IFocusService,
    controlsService: IControlsService
  ) {
    super(form, parent, controlStyle, resolver, eventsService, focusService);
    this.setVchControl(new VchContainer(this));
    this.controls = new Array<ControlWrapper>();
    this.controlsService = controlsService;
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

  public getInvertFlowDirection(): boolean {
    return this.getPropertyStore().getInvertFlowDirection();
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this.getVchContainer().getChildrenInFlowDirection();
  }

  public addChild(control: ControlWrapper): void {
    this.controls.push(control);
  }

  public removeChild(control: ILayoutableControl): void {
    // this.controls.remove(control);
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

  public attachComponent(container: ILayoutableContainerWrapper): void {
    super.attachComponent(container);
    this.attachSubComponents(this);
  }

  protected attachSubComponents(container: ILayoutableContainerWrapper): void {
    for (const child of this.controls) {
      child.attachComponent(container);
    }
  }

  public attachToVch(container: ILayoutableContainerWrapper): void {
    super.attachToVch(container);
    this.attachChildrenToVch(this);
  }

  protected attachChildrenToVch(container: ILayoutableContainerWrapper): void {
    for (const child of this.controls) {
      child.attachToVch(container);
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

}
