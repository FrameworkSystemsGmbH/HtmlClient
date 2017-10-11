import { Injectable, Injector } from '@angular/core';

import { TextBoxPlainWrapper } from '../textbox-plain-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';

@Injectable()
export class TextBoxPlainWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxPlainWrapper {
    return new TextBoxPlainWrapper(form, parent, controlStyle, this.injector);
  }
}
