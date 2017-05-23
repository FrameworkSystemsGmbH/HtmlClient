import { LayoutableContainer } from '.';

export abstract class Layout {

  constructor(private container: LayoutableContainer) { }

  public getContainer(): LayoutableContainer {
    return this.container;
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

  public abstract arrange(): void;

}
