import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { TextBoxNumberWrapper } from '../textbox-number-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';
import { PatternFormatService } from '../../services/formatter/pattern-format.service';

@Injectable()
export class TextBoxNumberWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxNumberWrapper {
    return new TextBoxNumberWrapper(form, parent, controlStyle, this.injector);
  }
}
