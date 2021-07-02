import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { DataList } from '@app/common/data-list';
import { ControlComponent } from '@app/controls/control.component';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';

@Directive()
export abstract class ComboBoxComponent extends ControlComponent {

  @Output()
  public readonly selectionChanged: EventEmitter<void> = new EventEmitter<void>();

  public entries: DataList | null = null;
  public selectedIndex: number | null = null;

  protected getSelectedIndex(): number | null {
    return this.selectedIndex;
  }

  protected setSelectedIndex(index: number | null): void {
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

  protected callSelectionChanged(): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnSelectionChangedEvent()) {
      this.selectionChanged.emit();
    }
  }

  public getWrapper(): ComboBoxWrapper {
    return super.getWrapper() as ComboBoxWrapper;
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedPk());
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.entries = wrapper.getEntries();
  }

  public getFocusElement(): HTMLElement | null {
    const control: ElementRef<HTMLElement> | null = this.getControl();

    if (control) {
      return control.nativeElement;
    }

    return null;
  }

  public abstract getControl(): ElementRef<HTMLElement> | null;

  public abstract getSelectedPk(): string | null;

  public abstract getArrowWidth(): number;
}
