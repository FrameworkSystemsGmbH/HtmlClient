import { LayoutableContainer } from '../layoutable-container';
import { FieldRowLabelMode } from './field-row-label-mode';
import { FieldContainer } from './field-container';

export interface FieldRowControl extends LayoutableContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getLayoutParent(): FieldContainer;

}
