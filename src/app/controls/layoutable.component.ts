import { Directive, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

@Directive()
export abstract class LayoutableComponent implements OnInit, DoCheck, OnDestroy {

  private _wrapper: ILayoutableControlWrapper | null = null;

  public ngOnInit(): void {
    // Neu gerenderte Angular Components ziehen sich die Daten aus dem Wrapper
    this.updateComponent();
  }

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
  }

  public ngOnDestroy(): void {
    if (this._wrapper) {
      this._wrapper.onComponentDestroyed();
    }
  }

  public getWrapper(): ILayoutableControlWrapper {
    if (this._wrapper == null) {
      throw new Error('Tried to access uninitialized component wrapper');
    }

    return this._wrapper;
  }

  public setWrapper(wrapper: ILayoutableControlWrapper): void {
    this._wrapper = wrapper;
  }

  public updateComponent(): void {
    const wrapper: ILayoutableControlWrapper = this.getWrapper();
    this.updateData(wrapper);
    this.updateStyles(wrapper);
  }

  // Überschrieben von allen Controls. Hier wird dann spezifisch bestimmt, welche
  // Daten upgedated werden müssen.
  protected updateData(wrapper: ILayoutableControlWrapper): void {
    // Updates component properties
  }

  // Überschrieben von allen Controls. Hier wird dann spezifisch bestimmt, welche
  // Styles upgedated werden müssen.
  protected updateStyles(wrapper: ILayoutableControlWrapper): void {
    // Updates component styles
  }
}
