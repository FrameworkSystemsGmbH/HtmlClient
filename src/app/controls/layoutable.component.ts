import { OnInit } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';

export abstract class LayoutableComponent implements OnInit {

  private wrapper: ILayoutableControlWrapper;

  public ngOnInit(): void {
    this.updateComponent();
  }

  public getWrapper(): ILayoutableControlWrapper {
    return this.wrapper;
  }

  public setWrapper(wrapper: ILayoutableControlWrapper): void {
    this.wrapper = wrapper;
  }

  public updateComponent(): void {
    const wrapper: ILayoutableControlWrapper = this.getWrapper();
    this.updateProperties(wrapper);
    this.updateStyles(wrapper);
  }

  protected abstract updateProperties(wrapper: ILayoutableControlWrapper): void;

  protected abstract updateStyles(wrapper: ILayoutableControlWrapper): void;
}
