import { LayoutableContainer } from './index';

export abstract class Layout {

  constructor(private container: LayoutableContainer) { }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

  public abstract arrange(): void;

  public getContainer(): LayoutableContainer {
    return this.container;
  }

}
