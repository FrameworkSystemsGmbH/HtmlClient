import { Component, ViewChild, ViewContainerRef, OnInit, ComponentRef } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { PlatformService } from 'app/services/platform.service';

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
  private listViewWrapper: ListViewWrapper;
  private contentCompRef: ComponentRef<ListViewItemContentComponent>;
  private contentCompInstance: ListViewItemContentComponent;

  constructor(
    private baseFormatService: BaseFormatService,
    private platformService: PlatformService
  ) { }

  public ngOnInit(): void {
    this.attachContentComponent();
    this.updateComponent();
  }

  public getId(): string {
    return this.id;
  }

  public getSelectorVisible(): boolean {
    if (this.selectionMode === ListViewSelectionMode.None) {
      return false;
    }

    if (this.platformService.isMobile()) {
      return this.selected || this.listViewWrapper.getMobileSelectionModeEnabled();
    } else {
      return this.selected || this.isHover;
    }
  }

  public setWrapper(itemWrapper: ListViewItemWrapper) {
    this.itemWrapper = itemWrapper;
    this.listViewWrapper = itemWrapper.getListViewWrapper();
  }

  private updateWrapper(): void {
    this.itemWrapper.setSelected(this.selected);
  }

  public updateComponent(): void {
    this.updateData(this.itemWrapper);
    this.updateStyles(this.itemWrapper);
  }

  private updateData(itemWrapper: ListViewItemWrapper): void {
    this.id = itemWrapper.getId();
    this.minWidth = this.listViewWrapper.getItemMinWidth();
    this.minHeight = this.listViewWrapper.getItemMinHeight();
    this.selectionMode = this.listViewWrapper.getSelectionMode();
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

  public onPress(event: any): void {
    if (!this.platformService.isMobile() || this.selectionMode === ListViewSelectionMode.None) {
      return;
    }

    if (this.selectionMode === ListViewSelectionMode.Single) {
      this.selected = !this.selected;
    } else {
      if (this.listViewWrapper.getMobileSelectionModeEnabled()) {
        this.listViewWrapper.setMobileSelectionModeEnabled(false);
      } else {
        this.listViewWrapper.setMobileSelectionModeEnabled(true);

        if (!this.selected && this.listViewWrapper.getSelectedItems().length === 0) {
          this.selected = true;
        }
      }
    }
  }

  public onTap(event: any): void {
    if (this.platformService.isMobile() && this.listViewWrapper.getMobileSelectionModeEnabled()) {
      this.selected = !this.selected;
    }
  }
}
