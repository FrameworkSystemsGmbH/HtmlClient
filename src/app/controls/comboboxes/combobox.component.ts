import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { DataList } from '@app/common/data-list';
import { ControlComponent } from '@app/controls/control.component';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';

@Directive()
export abstract class ComboBoxComponent extends ControlComponent {

  @Output()
  public selectionChanged: EventEmitter<any>;

  public entries: DataList;
  public selectedIndex: number;

  public abstract getControl(): ElementRef;

  public abstract getSelectedPk(): string;

  public abstract getArrowWidth(): number;

  protected getSelectedIndex(): number {
    return this.selectedIndex;
  }

  protected setSelectedIndex(index: number): void {
    this.selectedIndex = index;
  }

  public onAfterEnter(): void {
    // Override in subclasses
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable) {
      this.updateWrapper();
      super.callCtrlLeave(event);
    }
  }

  protected callSelectionChanged(event?: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnSelectionChangedEvent()) {
      this.selectionChanged.emit(event);
    }
  }

  public getWrapper(): ComboBoxWrapper {
    return super.getWrapper() as ComboBoxWrapper;
  }

  public setWrapper(wrapper: ComboBoxWrapper): void {
    super.setWrapper(wrapper);
    if (wrapper.hasOnSelectionChangedEvent()) {
      this.selectionChanged = new EventEmitter<any>();
    }
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedPk());
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.entries = wrapper.getEntries();
  }

  public getFocusElement(): any {
    const control: ElementRef = this.getControl();

    if (control) {
      return control.nativeElement;
    }
  }
}
