import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
import { TabPageComponent } from '@app/controls/tabbed-window/tab-page.component';
import { ControlType } from '@app/enums/control-type';
import { ContainerWrapper } from '@app/wrappers/container-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { TabbedWindowWrapper } from '@app/wrappers/tabbed-window/tabbed-window-wrapper';

export class TabPageWrapper extends ContainerWrapper implements ILayoutableContainerWrapper {

  public getControlType(): ControlType {
    return ControlType.TabPage;
  }

  public getActiveImage(): string | null {
    const activeImage: string | undefined = this.getPropertyStore().getActiveImage();
    return activeImage != null ? activeImage : null;
  }

  public getInactiveImage(): string | null {
    const inactiveImage: string | undefined = this.getPropertyStore().getInactiveImage();
    return inactiveImage != null ? inactiveImage : null;
  }

  public isTabSelected(): boolean {
    return this.getTabbedWindow().isTabSelected(this);
  }

  protected getTabbedWindow(): TabbedWindowWrapper {
    return this.getParent() as TabbedWindowWrapper;
  }

  protected getComponentRef(): ComponentRef<TabPageComponent> | null {
    return super.getComponentRef() as ComponentRef<TabPageComponent> | null;
  }

  protected getComponent(): TabPageComponent | null {
    const compRef: ComponentRef<TabPageComponent> | null = this.getComponentRef();
    return compRef ? compRef.instance : null;
  }

  public getViewContainerRef(): ViewContainerRef {
    const comp: TabPageComponent | null = this.getComponent();

    if (comp == null) {
      throw new Error('Tried to get TabPageComponent ViewContainerRef but component is NULL');
    }
    return comp.getViewContainerRef();
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<TabPageComponent> {
    const factory: ComponentFactory<TabPageComponent> = this.getResolver().resolveComponentFactory(TabPageComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
