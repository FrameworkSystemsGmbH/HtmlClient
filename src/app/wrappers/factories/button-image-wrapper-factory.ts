import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { ButtonImageWrapper } from '../button-image-wrapper';
import { ContainerWrapper } from '../container-wrapper';
import { FormWrapper } from '../form-wrapper';
import { PropertyData } from '../../common';
import { EventsService } from '../../services/events.service';
import { FontService } from '../../services/font.service';
import { ImageService } from '../../services/image.service';

@Injectable()
export class ButtonImageWrapperFactory {
  constructor(private injector: Injector) { }

  public create(form: FormWrapper, parent: ContainerWrapper, controlStyle: PropertyData): ButtonImageWrapper {
    return new ButtonImageWrapper(form, parent, controlStyle, this.injector);
  }
}
