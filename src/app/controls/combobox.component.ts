import { Output, EventEmitter, DoCheck } from '@angular/core';

import { ControlComponent } from 'app/controls/control.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { DataList } from 'app/common/data-list';

export abstract class ComboBoxComponent extends ControlComponent implements DoCheck {

  @Output()
  public onSelectionChanged: EventEmitter<any>;

  public entries: DataList;
  public selectedIndex: number;

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
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
    if (this.isEditable) {
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

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedPk());
  }

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    super.updateProperties(wrapper);
    this.entries = wrapper.getEntries();
  }
}
