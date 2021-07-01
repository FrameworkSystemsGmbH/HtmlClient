import { ClientEvent } from '@app/common/events/client-event';
import { ClientGotGeoLocationEventArgs } from '@app/common/events/eventargs/client-got-geo-location-eventargs';
import { ClientEventType } from '@app/enums/client-event-type';

export class ClientGotGeoLocationEvent extends ClientEvent {

  protected args: ClientGotGeoLocationEventArgs;

  public constructor(
    hasError?: boolean,
    errorMessage?: string,
    latitude?: number,
    longitude?: number,
    altitude?: number,
    accuracy?: number,
    heading?: number,
    speed?: number,
    timestamp?: number
  ) {
    super(ClientEventType[ClientEventType.GotGeoLocation]);
    this.args = new ClientGotGeoLocationEventArgs(hasError, errorMessage, latitude, longitude, altitude, accuracy, heading, speed, timestamp);
  }
}
