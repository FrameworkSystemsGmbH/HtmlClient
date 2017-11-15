import { ILayoutableControl } from 'app/layout/layoutable-control.interface';

export abstract class LayoutBase {

  constructor(private control: ILayoutableControl) { }

  public getControl(): ILayoutableControl {
    return this.control;
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

}
