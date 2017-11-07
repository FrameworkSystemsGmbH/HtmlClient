export class ClientLeaveEventArgs {

  protected activator: string;
  protected nextControlName: string;
  protected hasValueChanged: boolean;

  constructor(activator: string, nextControlName: string, hasValueChanged: boolean) {
    this.activator = activator;
    this.nextControlName = nextControlName;
    this.hasValueChanged = hasValueChanged;
  }

}
