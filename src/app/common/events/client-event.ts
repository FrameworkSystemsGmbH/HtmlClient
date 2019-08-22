export abstract class ClientEvent {

  protected event: string;

  constructor(event: string) {
    this.event = event;
  }
}
