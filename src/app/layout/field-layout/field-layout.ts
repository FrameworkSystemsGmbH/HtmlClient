import { FieldContainer } from '.';
import { Layout, LayoutableContainer } from '..';

export class FieldLayout extends Layout {

  constructor(container: FieldContainer) {
    super(container);
  }

  public getContainer(): FieldContainer {
    return <FieldContainer>super.getContainer();
  }

  public measureMinWidth(): number {
    return 0;
  }

  public measureMinHeight(width: number): number {
    return 0;
  }

  public arrange(): void {

  }

}
