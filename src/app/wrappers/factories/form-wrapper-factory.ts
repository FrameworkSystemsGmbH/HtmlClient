import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { ControlsService } from '../../services/controls.service';

@Injectable()
export class FormWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): FormWrapper {
    return new FormWrapper(form, parent, controlStyle, this.injector);
  }
}
