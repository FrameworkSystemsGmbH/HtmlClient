export abstract class ClientEvent {

  protected event: string;
  protected formId: string;
  protected controlName: string;

  constructor(event: string, formId: string, controlName: string) {
    this.event = event;
    this.formId = formId;
    this.controlName = controlName;
  }
}
