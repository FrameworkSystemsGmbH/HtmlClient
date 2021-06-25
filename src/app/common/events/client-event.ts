export abstract class ClientEvent {

  protected event: string;

  public constructor(event: string) {
    this.event = event;
  }
}
