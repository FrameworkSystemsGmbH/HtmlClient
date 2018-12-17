import { ComponentRef, ComponentFactory } from '@angular/core';

import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ListViewComponent } from 'app/controls/listview/listview.component';
import { ControlType } from 'app/enums/control-type';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';

export class ListViewWrapper extends ControlWrapper {

  public getControlType(): ControlType {
    return ControlType.ListView;
  }

  protected getComponentRef(): ComponentRef<ListViewComponent> {
    return super.getComponentRef() as ComponentRef<ListViewComponent>;
  }

  protected getComponent(): ListViewComponent {
    const compRef: ComponentRef<ListViewComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getSelectionMode(): ListViewSelectionMode {
    const selectionMode: ListViewSelectionMode = this.getPropertyStore().getSelectionMode();
    return selectionMode != null ? selectionMode : ListViewSelectionMode.None;
  }

  public getItemArrangement(): ListViewItemArrangement {
    const itemArrangement: ListViewItemArrangement = this.getPropertyStore().getItemArrangement();
    return itemArrangement != null ? itemArrangement : ListViewItemArrangement.List;
  }

  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    const horizontalContentAlignment: HorizontalContentAlignment = this.getPropertyStore().getHorizontalContentAlignment();
    return horizontalContentAlignment != null ? horizontalContentAlignment : HorizontalContentAlignment.Left;
  }

  public getVerticalContentAlignment(): VerticalContentAlignment {
    const verticalContentAlignment: VerticalContentAlignment = this.getPropertyStore().getVerticalContentAlignment();
    return verticalContentAlignment != null ? verticalContentAlignment : VerticalContentAlignment.Top;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ListViewComponent> {
    const factory: ComponentFactory<ListViewComponent> = this.getResolver().resolveComponentFactory(ListViewComponent);
    return factory.create(container.getViewContainerRef().injector);
  }
}
