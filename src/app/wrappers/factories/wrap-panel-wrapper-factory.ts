import { Injectable, Injector } from '@angular/core';

import { WrapPanelWrapper } from '../wrap-panel-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';

@Injectable()
export class WrapPanelWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): WrapPanelWrapper {
    return new WrapPanelWrapper(form, parent, controlStyle, this.injector);
  }
}
