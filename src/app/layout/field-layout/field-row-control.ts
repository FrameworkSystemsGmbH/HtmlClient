import { LayoutableContainer } from '..';
import { FieldRowLabelMode, FieldContainer } from '.';

export interface FieldRowControl extends LayoutableContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getLayoutParent(): FieldContainer;

}
