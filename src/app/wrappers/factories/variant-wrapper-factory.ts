import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { VariantWrapper } from '../variant-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { ControlsService } from '../../services/controls.service';

@Injectable()
export class VariantWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): VariantWrapper {
    return new VariantWrapper(form, parent, controlStyle, this.injector);
  }
}
