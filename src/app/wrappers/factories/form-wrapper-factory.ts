import { Injectable, Injector } from '@angular/core';

import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';

@Injectable()
export class FormWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): FormWrapper {
    return new FormWrapper(form, parent, controlStyle, this.injector);
  }
}
