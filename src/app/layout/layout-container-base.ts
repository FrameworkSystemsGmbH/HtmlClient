import { LayoutBase, LayoutableContainer, LayoutableControlWrapper, LayoutableControl } from '.';

export abstract class LayoutContainerBase extends LayoutBase {

  constructor(private container: LayoutableContainer) {
    super(container);
  }

  public getControl(): LayoutableContainer {
    return super.getControl() as LayoutableContainer;
  }

  public doLayout(): void {
    this.arrange();
    for (let control of this.getControl().getLayoutableControls()) {
      let container: LayoutableContainer = control as LayoutableContainer;
      if (container) {
        let layout: any = container.getLayout();
        if (layout.doLayout) {
          layout.doLayout();
        }
      }
    }
  }

  protected abstract arrange(): void;

}
