import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { IHeaderOptions } from 'app/wrappers/listview-wrapper';

export interface IListViewLayoutControl extends ILayoutableControl {

  getSpacingHorizontal(): number;

  getSpacingVertical(): number;

  getIsMobileLayout(): boolean;

  getSelectionMode(): ListViewSelectionMode;

  getMobileSelectionModeEnabled(): boolean;

  getHeaderOptions(): IHeaderOptions;

  getItemArrangement(): ListViewItemArrangement;

  getItemCount(): number;

  getItemWidth(): number;

  getItemHeight(): number;

}
