import { IListViewLayoutControl } from 'app/layout/listview-layout/listview-layout-control.interface';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { Visibility } from 'app/enums/visibility';
import { LayoutBase } from 'app/layout/layout-base';

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
    const listViewMinWidth: number = control.getMinWidth() + control.getMarginLeft() + control.getMarginRight();

    // The greater value wins: The calculated minimum width for the item or the defined listview minimum width
    return Math.max(itemWidth, Number.zeroIfNull(listViewMinWidth));
  }

  public measureMinHeight(width: number): number {
    const control: IListViewLayoutControl = this.getControl();

    if (control.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    if (!control.getIsMobileLayout()) {
      return this.measureMinHeightDesktop(control, width);
    } else if (control.getItemArrangement() === ListViewItemArrangement.List) {
      return this.measureMinHeightMobileList(control, width);
    } else {
      return this.measureMinHeightMobileWrap(control, width);
    }
  }

  protected measureMinHeightDesktop(control: IListViewLayoutControl, width: number): number {
    // Get the minimum height of an item
    let itemHeight: number = control.getItemHeight();

    if (itemHeight > 0) {
      // Include vertical insets (padding + border + margin) of the listview
      itemHeight += control.getInsetsTop() + control.getInsetsBottom();
    }

    // Determine the listview minimum hieght and add vertical margins
    const listViewMinHeight: number = control.getMinHeight() + control.getMarginTop() + control.getMarginBottom();

    // The greater value wins: The calculated minimum height for the item or the defined listview minimum height
    return Math.max(itemHeight, Number.zeroIfNull(listViewMinHeight));
  }

  protected measureMinHeightMobileList(control: IListViewLayoutControl, width: number): number {
    const vSpacing: number = control.getSpacingVertical();
    const itemCount: number = control.getItemCount();
    const itemHeight: number = control.getItemHeight();

    // Get the sum of item heights including vertical spacing
    let itemsHeight: number = (itemCount * itemHeight) + (Math.max(itemCount - 1, 0) * vSpacing);

    if (itemsHeight > 0) {
      // Include vertical insets (padding + border + margin) of the listview
      itemsHeight += control.getInsetsTop() + control.getInsetsBottom();
    }

    // Determine the listview minimum hieght and add vertical margins
    const listViewMinHeight: number = control.getMinHeight() + control.getMarginTop() + control.getMarginBottom();

    // The greater value wins: The calculated minimum height for the item or the defined listview minimum height
    return Math.max(itemsHeight, Number.zeroIfNull(listViewMinHeight));
  }

  protected measureMinHeightMobileWrap(control: IListViewLayoutControl, width: number): number {
    const hSpacing: number = control.getSpacingHorizontal();
    const vSpacing: number = control.getSpacingVertical();
    const itemCount: number = control.getItemCount();
    const itemWidth: number = control.getItemWidth();
    const itemHeight: number = control.getItemHeight();

    // The available width is the listview width - horizontal insets
    const availableWidth: number = width - control.getInsetsLeft() - control.getInsetsRight();

    // Calculate how many items fit into a single row including horizontal spacing
    let rowItemCount: number = 1;

    while ((((rowItemCount + 1) * itemWidth) + (rowItemCount * hSpacing)) <= availableWidth) {
      rowItemCount++;
    }

    // Calculate the amount of rows
    const rowCount = Math.ceilDec(itemCount / rowItemCount, 0);

    // Calculate the height of all rows including vertical spacing
    let rowsHeight: number = (rowCount * itemHeight) + (Math.max(rowCount - 1, 0) * vSpacing);

    if (rowsHeight > 0) {
      // Include vertical insets (padding + border + margin) of the listview
      rowsHeight += control.getInsetsTop() + control.getInsetsBottom();
    }

    // Determine the listview minimum hieght and add vertical margins
    const listViewMinHeight: number = control.getMinHeight() + control.getMarginTop() + control.getMarginBottom();

    // The greater value wins: The calculated minimum height for the item or the defined listview minimum height
    return Math.max(rowsHeight, Number.zeroIfNull(listViewMinHeight));
  }
}
