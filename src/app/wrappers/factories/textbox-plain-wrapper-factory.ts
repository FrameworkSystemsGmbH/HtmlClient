import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { TextBoxPlainWrapper } from '../textbox-plain-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';
import { PatternFormatService } from '../../services/formatter/pattern-format.service';
import { StringFormatService } from '../../services/formatter/string-format.service';

@Injectable()
export class TextBoxPlainWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxPlainWrapper {
    return new TextBoxPlainWrapper(form, parent, controlStyle, this.injector);
  }
}
