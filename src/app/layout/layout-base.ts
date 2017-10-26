import { ILayoutableControl } from './layoutable-control';

export abstract class LayoutBase {

  constructor(private control: ILayoutableControl) { }

  public getControl(): ILayoutableControl {
    return this.control;
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

}
