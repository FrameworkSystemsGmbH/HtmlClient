import { FieldRowLabelMode, FieldContainer } from '.';
import { LayoutableContainer } from '..';

export interface FieldRowControl extends LayoutableContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getLayoutParent(): FieldContainer;

}
