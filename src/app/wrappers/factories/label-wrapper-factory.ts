import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { LabelWrapper } from '../label-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';

@Injectable()
export class LabelWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): LabelWrapper {
    return new LabelWrapper(form, parent, controlStyle, this.injector);
  }
}
