export abstract class ClientEvent {

  protected event: string;
  protected controlName: string;

  constructor(event: string, controlName: string) {
    this.event = event;
    this.controlName = controlName;
  }
}
