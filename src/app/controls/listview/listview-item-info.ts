import { ComponentFactory } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';

export interface IListViewItemInfo {
  id: string;
  minWidth: number;
  minHeight: number;
  itemContentFactory: ComponentFactory<ListViewItemContentComponent>;
}
