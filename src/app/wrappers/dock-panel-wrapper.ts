import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';

import { IDockContainer } from 'app/layout/dock-layout/dock-container.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ContainerWrapperSpaceable } from 'app/wrappers/container-wrapper-spaceable';
import { LayoutBase } from 'app/layout/layout-base';
import { DockLayout } from 'app/layout/dock-layout/dock-layout';
import { DockPanelComponent } from 'app/controls/layouts/dock-panel/dock-panel.component';
import { DockOrientation } from 'app/layout/dock-layout/dock-orientation';
import { DockPanelScrolling } from 'app/enums/dockpanel-scrolling';
import { ControlType } from 'app/enums/control-type';

export class DockPanelWrapper extends ContainerWrapperSpaceable implements IDockContainer {

  public supportsButtonGroup(): boolean {
    return true;
  }

  public getControlType(): ControlType {
    return ControlType.DockPanel;
  }

  protected createLayout(): LayoutBase {
    return new DockLayout(this);
  }

  protected getComponentRef(): ComponentRef<DockPanelComponent> {
    return super.getComponentRef() as ComponentRef<DockPanelComponent>;
  }

  protected getComponent(): DockPanelComponent {
    const compRef: ComponentRef<DockPanelComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getDockOrientation(): DockOrientation {
    const dockOrientation: DockOrientation = this.getPropertyStore().getDockOrientation();
    return dockOrientation != null ? dockOrientation : DockOrientation.Vertical;
  }

  public getDockPanelScrolling(): DockPanelScrolling {
    const dockPanelScrolling: DockPanelScrolling = this.getPropertyStore().getDockPanelScrolling();
    return dockPanelScrolling != null ? dockPanelScrolling : DockPanelScrolling.None;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<DockPanelComponent> {
    const factory: ComponentFactory<DockPanelComponent> = this.getResolver().resolveComponentFactory(DockPanelComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
