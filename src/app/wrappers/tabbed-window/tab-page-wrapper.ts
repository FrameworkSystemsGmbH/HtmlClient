import { ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { TabPageComponent } from 'app/controls/tabbed-window/tab-page.component';
import { ControlType } from 'app/enums/control-type';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { TabbedWindowWrapper } from 'app/wrappers/tabbed-window/tabbed-window-wrapper';

export class TabPageWrapper extends ContainerWrapper implements ILayoutableContainerWrapper {

  public getControlType(): ControlType {
    return ControlType.TabPage;
  }

  public getBackColor(): string {
    let backColor: string = this.getPropertyStore().getBackColor();

    if (backColor != null) {
      return backColor;
    }

    const parent: TabbedWindowWrapper = this.getParent() as TabbedWindowWrapper;

    if (parent != null) {
      backColor = parent.getBackColor();
      if (backColor != null) {
        return backColor;
      }
    }

    return '#FFFFFF';
  }

  public getActiveImage(): string {
    return this.getPropertyStore().getActiveImage();
  }

  public getInactiveImage(): string {
    return this.getPropertyStore().getInactiveImage();
  }

  protected getComponentRef(): ComponentRef<TabPageComponent> {
    return super.getComponentRef() as ComponentRef<TabPageComponent>;
  }

  protected getComponent(): TabPageComponent {
    const compRef: ComponentRef<TabPageComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TabPageComponent> {
    const factory: ComponentFactory<TabPageComponent> = this.getResolver().resolveComponentFactory(TabPageComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
