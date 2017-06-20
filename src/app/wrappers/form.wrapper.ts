import { ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { BaseWrapper, ContainerWrapper } from '.';
import { ControlType } from '../enums';
import { FormComponent } from '../controls';
import { ResponseFormDto } from '../communication/response';
import { PropertyLayer } from '../common';

export class FormWrapper extends ContainerWrapper {

  private id: number;
  private title: string;
  private fullName: string;

  public getId(): number {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  protected getComponentRef(): ComponentRef<FormComponent> {
    return <ComponentRef<FormComponent>>super.getComponentRef();
  }

  protected getComponent(): FormComponent {
    return this.getComponentRef().instance;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public setJson(json: any, isNew: boolean): void {
    super.setJson(json, isNew);
    if (json.controls && json.controls.length) {
      this.setControlsJson(json.controls, isNew);
    }
  }

  protected setMetaJson(metaJson: any): void {
    this.id = metaJson.id;
    this.fullName = metaJson.fullName;
  }

  protected setDataJson(dataJson: any): void {
    super.setDataJson(dataJson);
    this.title = dataJson.title;
  }

  protected setControlsJson(controlsJson: any, isNew: boolean): void {
    for (let controlJson of controlsJson) {
      if (isNew) {
        let parent: ContainerWrapper = this;
        if (controlJson.meta.parentName) {
          parent = this.findControlRecursive(controlJson.meta.parentName) as ContainerWrapper;
        }
        let control: BaseWrapper = this.controlsService.createWrapperFromType(controlJson.meta.typeId, this, parent);
        control.setJson(controlJson, true);
      } else {
        let controlName: string = controlJson.name;
        let controlWrps: Array<BaseWrapper> = this.controls.filter((controlWrp: BaseWrapper) => controlWrp.getName() === controlName);
        if (controlWrps && controlWrps.length) {
          let control: BaseWrapper = controlWrps[0];
          control.setJson(controlJson, false);
        }
      }
    }
  }

  public setFocusControl(name: string): void {
    let control: BaseWrapper = this.findControlRecursive(name);

    if (control) {
      control.setFocus();
    }
  }

  public attachComponentToFrame(vc: ViewContainerRef): void {
    let cfr: ComponentFactoryResolver = this.appInjector.get(ComponentFactoryResolver);
    let factory: ComponentFactory<FormComponent> = cfr.resolveComponentFactory(FormComponent);
    let comp: ComponentRef<FormComponent> = vc.createComponent(factory);
    this.setComponentRef(comp);
    comp.instance.setWrapper(this);

    for (let child of this.controls) {
      child.attachComponent(this);
    }
  }

  public attachComponent(container: ContainerWrapper): void {
    // A form is directly attached to a FrameComponent by calling 'attachComponentToFrame()'
  }

  public createComponent(container: ContainerWrapper): void {
    // A form creates its component directly on the frame's ViewContainerRef in 'attachComponentToFrame()'
  }

  public updateComponent(): void {

  }

}
