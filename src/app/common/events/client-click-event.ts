import { ClientEvent } from '.';
import { ControlEvent } from '../../enums';

export class ClientClickEvent extends ClientEvent {

  constructor(formId: string, controlName: string) {
    super(ControlEvent[ControlEvent.OnClick], formId, controlName);
  }

}
