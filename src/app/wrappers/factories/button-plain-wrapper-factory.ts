import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { ButtonPlainWrapper } from '../button-plain-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';

@Injectable()
export class ButtonPlainWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): ButtonPlainWrapper {
    return new ButtonPlainWrapper(form, parent, controlStyle, this.injector);
  }
}
