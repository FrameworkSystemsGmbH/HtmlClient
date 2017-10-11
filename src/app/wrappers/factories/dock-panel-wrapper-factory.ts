import { Injectable, Injector } from '@angular/core';

import { DockPanelWrapper } from '../dock-panel-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';

@Injectable()
export class DockPanelWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): DockPanelWrapper {
    return new DockPanelWrapper(form, parent, controlStyle, this.injector);
  }
}
