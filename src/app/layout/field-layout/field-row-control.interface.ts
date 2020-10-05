import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';
import { IFieldContainer } from '@app/layout/field-layout/field-container.interface';

import { FieldRowLabelMode } from '@app/layout/field-layout/field-row-label-mode';

export interface IFieldRowControl extends ILayoutableContainer {

  getFieldRowSize(): number;

  getFieldRowLabelMode(): FieldRowLabelMode;

  getFieldContainer(): IFieldContainer;

  getHasFirstColumnControl(): boolean;

}
