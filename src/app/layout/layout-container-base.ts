import { LayoutBase } from './layout-base';
import { ILayoutableContainer } from './layoutable-container';

export abstract class LayoutContainerBase extends LayoutBase {

  constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ILayoutableContainer {
    return super.getControl() as ILayoutableContainer;
  }

  public doLayout(): void {
    this.arrange();
    for (const control of this.getControl().getLayoutableControls()) {
      const container: ILayoutableContainer = control as ILayoutableContainer;
      if (container) {
        const layout: any = container.getLayout();
        if (layout.doLayout) {
          layout.doLayout();
        }
      }
    }
  }

  protected abstract arrange(): void;

}
