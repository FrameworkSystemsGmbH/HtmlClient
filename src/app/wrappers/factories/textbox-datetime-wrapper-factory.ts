import { Injectable, Injector } from '@angular/core';

import { TextBoxDateTimeWrapper } from '../textbox-datetime-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';

@Injectable()
export class TextBoxDateTimeWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxDateTimeWrapper {
    return new TextBoxDateTimeWrapper(form, parent, controlStyle, this.injector);
  }
}
