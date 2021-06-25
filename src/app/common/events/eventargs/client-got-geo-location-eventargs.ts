export class ClientGotGeoLocationEventArgs {

  protected hasError: boolean;
  protected errorMessage: string;
  protected latitude: number;
  protected longitude: number;
  protected altitude: number;
  protected accuracy: number;
  protected heading: number;
  protected speed: number;
  protected timestamp: number;

  public constructor(hasError: boolean, errorMessage: string, latitude: number, longitude: number, altitude: number, accuracy: number, heading: number, speed: number, timestamp: number) {
    this.hasError = hasError;
    this.errorMessage = errorMessage;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.accuracy = accuracy;
    this.heading = heading;
    this.speed = speed;
    this.timestamp = timestamp;
  }
}
