import { LayoutableControl } from './layoutable-control';

export abstract class LayoutBase {

  constructor(private control: LayoutableControl) { }

  public getControl(): LayoutableControl {
    return this.control;
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

}
