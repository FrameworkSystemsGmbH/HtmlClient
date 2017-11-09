import { ILayoutableContainer } from '../layoutable-container';
import { FieldRowLabelMode } from './field-row-label-mode';
import { IFieldContainer } from './field-container';

export interface IFieldRowControl extends ILayoutableContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getFieldContainer(): IFieldContainer;

}
