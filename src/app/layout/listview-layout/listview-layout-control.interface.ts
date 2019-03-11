import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';

export interface IListViewLayoutControl extends ILayoutableControl {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getIsMobileLayout(): boolean;

  getItemArrangement(): ListViewItemArrangement;

  getItemCount(): number;

  getItemMinWidth(): number;

  getItemMinHeight(): number;

}
