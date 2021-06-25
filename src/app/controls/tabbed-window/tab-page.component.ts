import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import * as StyleUtil from '@app/util/style-util';
import { TabPageWrapper } from '@app/wrappers/tabbed-window/tab-page-wrapper';

@Component({
  selector: 'hc-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss']
})
export class TabPageComponent extends ContainerComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef;

  public wrapperStyle: any;

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: TabPageWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: TabPageWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;
    const isSelected: boolean = wrapper.isTabSelected();

    return {
      'display': isVisible && isSelected ? 'flex' : 'none',
      'flex-direction': 'column',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight)
    };
  }
}
