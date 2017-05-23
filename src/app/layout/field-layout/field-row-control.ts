import { FieldRowLabelMode, FieldContainer } from '.';
import { LayoutableControl, LayoutableControlLabel } from '..';

export interface FieldRowControl extends LayoutableControl {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getLayoutParent(): FieldContainer;

  getLayoutChildren(): Array<LayoutableControl>;

}
