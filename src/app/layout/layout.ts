import { LayoutContainer } from '.';

export abstract class Layout {

  constructor(private container: LayoutContainer) { }

  public getContainer(): LayoutContainer {
    return this.container;
  }

  public abstract measureMinWidth(): number;

  public abstract measureMinHeight(width: number): number;

  public abstract arrange(): void;

}
