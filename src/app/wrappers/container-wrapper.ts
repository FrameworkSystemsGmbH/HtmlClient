import { ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { IControlsService } from '../services/controls.service';
import { IEventsService } from '../services/events.service';
import { IFocusService } from '../services/focus.service';

import { BaseWrapper } from './base-wrapper';
import { FormWrapper } from './form-wrapper';
import { ContainerComponent } from '../controls/container.component';
import { ILayoutableContainer } from '../layout/layoutable-container';
import { PropertyData } from '../common/property-data';
import { VchContainer } from '../vch/vch-container';
import { LayoutContainerBase } from '../layout/layout-container-base';
import { LayoutBase } from '../layout/layout-base';
import { ContainerLayout } from '../layout/container-layout/container-layout';
import { ILayoutableControl } from '../layout/layoutable-control';
import { JsonUtil } from '../util/json-util';

export abstract class ContainerWrapper extends BaseWrapper implements ILayoutableContainer {

  protected controls: Array<BaseWrapper>;
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
    this.vchControl = new VchContainer(this);
    this.controls = new Array<BaseWrapper>();
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
    return this.propertyStore.getInvertFlowDirection();
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this.getVchContainer().getChildrenInFlowDirection();
  }

  public addControl(control: BaseWrapper): void {
    this.controls.push(control);
  }

  public removeChild(child: ILayoutableControl): void {

  }

  public getControlsJson(controlsJson: Array<any>): void {
    this.controls.forEach((controlWrp: BaseWrapper) => {
      const controlJson: any = controlWrp.getJson();

      if (controlJson && !JsonUtil.isEmptyObject(controlJson)) {
        controlsJson.push(controlJson);
      }

      if (controlWrp instanceof ContainerWrapper) {
        (controlWrp as ContainerWrapper).getControlsJson(controlsJson);
      }
    });
  }

  public attachComponent(container: ContainerWrapper): void {
    super.attachComponent(container);
    this.attachSubComponents(this);
  }

  protected attachSubComponents(container: ContainerWrapper): void {
    for (const child of this.controls) {
      child.attachComponent(container);
    }
  }

  public findControl(name: string): BaseWrapper {
    for (const control of this.controls) {
      if (control.getName() === name) {
        return control;
      }
    }

    return null;
  }

  public findControlRecursive(name: string): BaseWrapper {
    let control: BaseWrapper = this.findControl(name);
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
