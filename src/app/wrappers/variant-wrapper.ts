import { ComponentRef, ComponentFactory, ViewContainerRef } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { VariantComponent } from 'app/controls/variant/variant.component';
import { ClientEventType } from 'app/enums/client-event-type';
import { ControlType } from 'app/enums/control-type';

export class VariantWrapper extends ContainerWrapper {

  public getControlType(): ControlType {
    return ControlType.Variant;
  }

  public getTitle(): string {
    return this.getPropertyStore().getTitle();
  }

  public getIsCloseIconVisible(): boolean {
    const isCloseIconVisible: boolean = this.getPropertyStore().getIsCloseIconVisible();
    return isCloseIconVisible != null ? isCloseIconVisible : false;
  }

  public isCloseEventAttached(): boolean {
    return (this.getEvents() & ClientEventType.OnClose) === ClientEventType.OnClose;
  }

  protected getComponentRef(): ComponentRef<VariantComponent> {
    return super.getComponentRef() as ComponentRef<VariantComponent>;
  }

  protected getComponent(): VariantComponent {
    const compRef: ComponentRef<VariantComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<VariantComponent> {
    const factory: ComponentFactory<VariantComponent> = this.getResolver().resolveComponentFactory(VariantComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
