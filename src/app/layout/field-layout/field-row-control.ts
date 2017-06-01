import { FieldRowLabelMode, FieldContainer } from '.';
import { LayoutContainer } from '..';

export interface FieldRowControl extends LayoutContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getLayoutParent(): FieldContainer;

}
