import { Component, ViewChild, ViewContainerRef, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemComponent } from 'app/controls/listview/listview-item.component';
import { ListViewItemValueWrapper } from 'app/wrappers/listview-item-value-wrapper';
import { BaseFormatService } from 'app/services/formatter/base-format.service';

@Component({
  selector: 'hc-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListViewComponent extends ControlComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  private itemRefs: Array<ComponentRef<ListViewItemComponent>> = new Array<ComponentRef<ListViewItemComponent>>();

  constructor(
    private cfr: ComponentFactoryResolver,
    private baseFormatService: BaseFormatService) {
    super();
  }

  public getWrapper(): ListViewWrapper {
    return super.getWrapper() as ListViewWrapper;
  }

  public setWrapper(wrapper: ListViewWrapper): void {
    super.setWrapper(wrapper);
  }

  protected updateData(wrapper: ListViewWrapper): void {
    super.updateData(wrapper);

    const itemWrappers: Array<ListViewItemWrapper> = wrapper.getItems();

    if (!itemWrappers || !itemWrappers.length) {
      return;
    }

    let posChange: boolean = false;

    for (const itemWrapper of itemWrappers) {
      if (itemWrapper.hasPosChanged()) {
        posChange = true;
      }

      if (itemWrapper.getIsNew()) {
        this.createItem(wrapper, itemWrapper);
      } else if (itemWrapper.getHasUiChanges()) {
        this.updateItem(itemWrapper);
      }
    }

    if (posChange) {
      this.sortItems(itemWrappers);
    }
  }

  protected updateStyles(wrapper: ListViewWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ListViewWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;
    const itemArrangement: ListViewItemArrangement = wrapper.getItemArrangement();
    const itemMinWidth: number = wrapper.getItemMinWidth();
    const spacingHorizontal: number = wrapper.getSpacingHorizontal();
    const spacingVertical: number = wrapper.getSpacingVertical();

    let wrapperStyle: any = {
      'display': isVisible ? 'grid' : 'none',
      'overflow': 'auto',
      'column-gap': StyleUtil.getValue('px', spacingHorizontal),
      'row-gap': StyleUtil.getValue('px', spacingVertical),
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutWidth,
      'height.px': layoutHeight,
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.getFourValue('px',
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.getFourValue('px',
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'cursor': !this.isEditable ? 'not-allowed' : null
    };

    if (itemArrangement === ListViewItemArrangement.List) {
      wrapperStyle = {
        ...wrapperStyle,
        'grid-template-columns': '1fr'
      };
    } else {
      wrapperStyle = {
        ...wrapperStyle,
        'grid-template-columns': `repeat(auto-fit, minmax(${StyleUtil.getValue('px', itemMinWidth)}, 1fr)`,
        'align-content': 'flex-start'
      };
    }

    return wrapperStyle;
  }

  private createItem(listViewWrapper: ListViewWrapper, itemWrapper: ListViewItemWrapper): void {
    const itemFactory: ComponentFactory<ListViewItemComponent> = this.cfr.resolveComponentFactory(ListViewItemComponent);
    const itemRef: ComponentRef<ListViewItemComponent> = this.anchor.createComponent(itemFactory, itemWrapper.getPos());
    const itemInstance: ListViewItemComponent = itemRef.instance;

    this.itemRefs.push(itemRef);

    itemInstance.setItemInfo({
      id: itemWrapper.getId(),
      minWidth: listViewWrapper.getItemMinWidth(),
      minHeight: listViewWrapper.getItemMinHeight(),
      itemContentFactory: listViewWrapper.getItemFactory()
    });

    itemInstance.setValues(this.getItemValues(itemWrapper));
    itemWrapper.setUiUpdated();
  }

  private updateItem(itemWrapper: ListViewItemWrapper): void {
    const itemRef: ComponentRef<ListViewItemComponent> = this.itemRefs.find(ir => ir.instance.getId() === itemWrapper.getId());
    itemRef.instance.setValues(this.getItemValues(itemWrapper));
    itemWrapper.setUiUpdated();
  }

  private getItemValues(itemWrapper: ListViewItemWrapper): Array<string> {
    return itemWrapper.getValues().map(v => this.baseFormatService.formatString(v.getValue(), v.getFormat(), v.getFormatPattern()));
  }

  private sortItems(itemWrappers: Array<ListViewItemWrapper>): void {
    for (let i = 0; i < itemWrappers.length; i++) {
      const itemWrapper: ListViewItemWrapper = itemWrappers[i];
      const itemRef: ComponentRef<ListViewItemComponent> = this.itemRefs.find(ir => ir.instance.getId() === itemWrapper.getId());
      const viewIndex: number = this.anchor.indexOf(itemRef.hostView);

      if (viewIndex !== i) {
        this.anchor.move(itemRef.hostView, i);
      }
    }
  }
}
