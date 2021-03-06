import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';
import { Visibility } from '@app/enums/visibility';
import { LayoutBase } from '@app/layout/layout-base';
import { IListViewLayoutControl } from '@app/layout/listview-layout/listview-layout-control.interface';

export class ListViewLayout extends LayoutBase {

  public getControl(): IListViewLayoutControl {
    return super.getControl() as IListViewLayoutControl;
  }

  public measureMinWidth(): number {
    const control: IListViewLayoutControl = this.getControl();

    if (control.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    // Get the minimum width of an item
    let itemWidth: number = control.getItemWidth();

    if (itemWidth > 0) {
      // Include horizontal insets (padding + border + margin) of the listview
      itemWidth += control.getInsetsLeft() + control.getInsetsRight();
    }

    // Determine the listview minimum width and add horizontal margins
    let listViewMinWidth: number = control.getMinWidth();

    if (listViewMinWidth > 0) {
      listViewMinWidth += control.getMarginLeft() + control.getMarginRight();
    }

    // The greater value wins: The calculated minimum width for the item or the defined listview minimum width
    return Math.max(itemWidth, Number.zeroIfNull(listViewMinWidth));
  }

  public measureMinHeight(width: number): number {
    const control: IListViewLayoutControl = this.getControl();

    if (control.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    // Take the header height into account if selection mode is 'Multiple'
    const headerHeight: number = control.getSelectionMode() === ListViewSelectionMode.Multiple ? control.getHeaderOptions().height : 0;

    // Get the minimum height of an item
    let itemHeight: number = control.getItemHeight();

    if (itemHeight > 0) {
      // Include vertical insets (padding + border + margin) of the listview
      itemHeight += control.getInsetsTop() + control.getInsetsBottom() + headerHeight;
    }

    // Determine the listview minimum hieght and add vertical margins
    let listViewMinHeight: number = control.getMinHeight();

    if (listViewMinHeight > 0) {
      listViewMinHeight += control.getMarginTop() + control.getMarginBottom() + headerHeight;
    }

    // The greater value wins: The calculated minimum height for the item or the defined listview minimum height
    return Math.max(itemHeight, Number.zeroIfNull(listViewMinHeight));
  }
}
