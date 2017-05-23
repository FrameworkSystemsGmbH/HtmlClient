import { LayoutableControl, LayoutableContainer } from '.';

export interface LayoutableControlLabel {

  getLayoutableControl(): LayoutableControl;

  // UIItem getUIItem ();
  // Component getComponent();

  // void setCaption(String caption);

  // Border getBorder();
  // void setBorder(Border border);

  getIsVisible(): boolean;

  // void applyToolTip();

  // void applyDragHandler();

  // void addMouseListener(MouseListener mouseListener);

  setParent(container: LayoutableContainer): void;

  // void dispose();
}
