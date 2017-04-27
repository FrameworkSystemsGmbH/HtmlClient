import { EventEmitter, Injectable, } from '@angular/core';

import { ClientEventArgs } from '../models/eventargs/client.eventargs';
import { BaseWrapper } from '../wrappers';

@Injectable()
export class EventsService {

  public readonly onEventFired: EventEmitter<ClientEventArgs> = new EventEmitter<ClientEventArgs>();

  public fireClick(controlWrp: BaseWrapper): void {
    let json: any = {
      control: controlWrp.getName(),
      event: 'click'
    };

    let eventArgs: ClientEventArgs = new ClientEventArgs(controlWrp.getForm(), json);

    this.onEventFired.emit(eventArgs);
  }

  public fireLeave(controlWrp: BaseWrapper): void {
    let json: any = {
      control: controlWrp.getName(),
      event: 'leave'
    };

    let eventArgs: ClientEventArgs = new ClientEventArgs(controlWrp.getForm(), json);

    this.onEventFired.emit(eventArgs);
  }

}
