import { OnInit, DoCheck } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';

export abstract class LayoutableComponent implements OnInit, DoCheck {

  private wrapper: ILayoutableControlWrapper;

  public ngOnInit(): void {
    this.updateComponent();
  }

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
  }

  public getWrapper(): ILayoutableControlWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: ILayoutableControlWrapper): void {
    this.wrapper = wrapper;
  }

  public updateComponent(): void {
    const wrapper: ILayoutableControlWrapper = this.getWrapper();
    this.updateData(wrapper);
    this.updateStyles(wrapper);
  }

  protected updateData(wrapper: ILayoutableControlWrapper): void {
    // Updates component properties
  }

  protected updateStyles(wrapper: ILayoutableControlWrapper): void {
    // Updates component styles
  }
}
