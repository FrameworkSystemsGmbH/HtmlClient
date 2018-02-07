import { Output, EventEmitter, OnInit, DoCheck } from '@angular/core';

import { ControlComponent } from 'app/controls/control.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { DataList } from 'app/common/data-list';

export abstract class ComboBoxComponent extends ControlComponent implements OnInit, DoCheck {

  @Output()
  public onSelectionChanged: EventEmitter<any>;

  public entries: DataList;
  public isEditable: boolean;
  public selectedIndex: number;

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public abstract getSelectedPk(): string;

  public abstract getArrowWidth(): number;

  protected getSelectedIndex(): number {
    return this.selectedIndex;
  }

  protected setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  public onAfterEnter(): void {
    // Override in subclasses
  }

  public callOnLeave(event: any): void {
    if (this.getWrapper().getIsEditable()) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  protected callOnSelectionChanged(event?: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnSelectionChangedEvent()) {
      this.onSelectionChanged.emit(event);
    }
  }

  public getWrapper(): ComboBoxWrapper {
    return super.getWrapper() as ComboBoxWrapper;
  }

  public setWrapper(wrapper: ComboBoxWrapper): void {
    super.setWrapper(wrapper);
    if (wrapper.hasOnSelectionChangedEvent()) {
      this.onSelectionChanged = new EventEmitter<any>();
    }
  }

  public updateComponent(): void {
    const wrapper: ComboBoxWrapper = this.getWrapper();
    this.updateProperties(wrapper);
    this.updateStyles(wrapper);
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedPk());
  }

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    this.isEditable = this.getWrapper().getIsEditable();
    this.entries = wrapper.getEntries();
  }

  protected abstract updateStyles(wrapper: ComboBoxWrapper): void;
}
