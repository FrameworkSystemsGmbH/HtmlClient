import { Component, ViewChild, ViewContainerRef, ComponentFactory, OnInit, ComponentRef } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { IListViewItemInfo } from 'app/controls/listview/listview-item-info';

@Component({
  selector: 'hc-listview-item',
  templateUrl: './listview-item.component.html',
  styleUrls: ['./listview-item.component.scss']
})
export class ListViewItemComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public containerStyle: any;
  public isHover: boolean;

  public selectedVal: boolean;

  get selected() {
    return this.selectedVal;
  }

  set selected(val) {
    this.selectedVal = val;
  }

  private id: string;
  private values: Array<string>;
  private minWidth: number;
  private minHeight: number;
  private itemContentFactory: ComponentFactory<ListViewItemContentComponent>;
  private compRef: ComponentRef<ListViewItemContentComponent>;
  private compInstance: ListViewItemContentComponent;

  public ngOnInit(): void {
    this.attachContentComponent();
  }

  private setContainerStyle(): any {
    this.containerStyle = {
      'min-width.px': this.minWidth,
      'min-height.px': this.minHeight
    };
  }

  public setItemInfo(info: IListViewItemInfo): void {
    this.id = info.id;
    this.setMinSize(info.minWidth, info.minHeight);
    this.itemContentFactory = info.itemContentFactory;
  }

  public setValues(values: Array<string>): void {
    this.values = values;
    this.setInstanceValues();
  }

  private setMinSize(minWidth: number, minHeight: number): void {
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.setContainerStyle();
  }

  public getId(): string {
    return this.id;
  }

  private attachContentComponent(): void {
    this.compRef = this.anchor.createComponent(this.itemContentFactory);
    this.compInstance = this.compRef.instance;
    this.setInstanceValues();
  }

  private setInstanceValues(): void {
    if (!this.compInstance) {
      return;
    }

    this.compInstance.values = this.values;
  }

  public getSelectorVisible(): boolean {
    return this.selected || this.isHover;
  }
}
