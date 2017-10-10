import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { TextBoxDateTimeWrapper } from '../textbox-datetime-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';
import { PatternFormatService } from '../../services/formatter/pattern-format.service';
import { DateTimeFormatService } from '../../services/formatter/datetime-format.service';

@Injectable()
export class TextBoxDateTimeWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): TextBoxDateTimeWrapper {
    return new TextBoxDateTimeWrapper(form, parent, controlStyle, this.injector);
  }
}
