import { Component, ViewChild, ViewContainerRef, ComponentFactory, OnInit, ComponentRef, Output } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { Subject } from 'rxjs';
import { BaseFormatService } from 'app/services/formatter/base-format.service';

@Component({
  selector: 'hc-listview-item',
  templateUrl: './listview-item.component.html',
  styleUrls: ['./listview-item.component.scss']
})
export class ListViewItemComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public isHover: boolean;
  public containerStyle: any;

  private selectedVal: boolean;

  get selected() {
    return this.selectedVal;
  }

  set selected(val) {
    const oldValue: boolean = this.selectedVal;
    this.selectedVal = val;

    this.updateWrapper();

    if (this.selectionMode === ListViewSelectionMode.Single && val && oldValue !== val) {
      this.itemWrapper.notifySingleSelectionChanged();
    }
  }

  private id: string;
  private values: Array<string>;
  private minWidth: number;
  private minHeight: number;
  private selectionMode: ListViewSelectionMode;
  private itemWrapper: ListViewItemWrapper;
  private contentCompRef: ComponentRef<ListViewItemContentComponent>;
  private contentCompInstance: ListViewItemContentComponent;

  constructor(private baseFormatService: BaseFormatService) { }

  public ngOnInit(): void {
    this.attachContentComponent();
    this.updateComponent();
  }

  public getId(): string {
    return this.id;
  }

  public getSelectorVisible(): boolean {
    return this.selectionMode !== ListViewSelectionMode.None && (this.selected || this.isHover);
  }

  public setWrapper(itemWrapper: ListViewItemWrapper) {
    this.itemWrapper = itemWrapper;
  }

  private updateWrapper(): void {
    this.itemWrapper.setSelected(this.selectedVal);
  }

  public updateComponent(): void {
    this.updateData(this.itemWrapper);
    this.updateStyles(this.itemWrapper);
  }

  private updateData(itemWrapper: ListViewItemWrapper): void {
    const listViewWrapper: ListViewWrapper = itemWrapper.getListViewWrapper();
    this.id = itemWrapper.getId();
    this.minWidth = listViewWrapper.getItemMinWidth();
    this.minHeight = listViewWrapper.getItemMinHeight();
    this.selectionMode = listViewWrapper.getSelectionMode();
    this.values = itemWrapper.getValues().map(v => this.baseFormatService.formatString(v.getValue(), v.getFormat(), v.getFormatPattern()));
    this.selectedVal = itemWrapper.getSelected();
    itemWrapper.confirmContentUpdate();
    this.setContentValues();
  }

  private updateStyles(itemWrapper: ListViewItemWrapper) {
    this.containerStyle = this.createContainerStyle(itemWrapper);
  }

  private createContainerStyle(itemWrapper: ListViewItemWrapper): any {
    return {
      'min-width.px': this.minWidth,
      'min-height.px': this.minHeight
    };
  }

  private attachContentComponent(): void {
    this.contentCompRef = this.anchor.createComponent(this.itemWrapper.getListViewWrapper().getItemFactory());
    this.contentCompInstance = this.contentCompRef.instance;
  }

  private setContentValues(): void {
    if (!this.contentCompInstance) {
      return;
    }

    this.contentCompInstance.values = this.values;
  }
}
