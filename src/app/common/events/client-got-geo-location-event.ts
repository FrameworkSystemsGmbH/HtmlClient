import { ClientEvent } from 'app/common/events/client-event';
import { ClientEventType } from 'app/enums/client-event-type';
import { ClientGotGeoLocationEventArgs } from 'app/common/events/eventargs/client-got-geo-location-eventargs';

export class ClientGotGeoLocationEvent extends ClientEvent {

  protected args: ClientGotGeoLocationEventArgs;

  constructor(hasError: boolean, errorMessage: string, latitude: number, longitude: number, altitude: number, accuracy: number, heading: number, speed: number, timestamp: number) {
    super(ClientEventType[ClientEventType.GotGeoLocation]);
    this.args = new ClientGotGeoLocationEventArgs(hasError, errorMessage, latitude, longitude, altitude, accuracy, heading, speed, timestamp);
  }
}
