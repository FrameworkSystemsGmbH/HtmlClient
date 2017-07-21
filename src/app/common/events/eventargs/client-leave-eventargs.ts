export class ClientLeaveEventArgs {

  private activator: string;
  private nextControlName: string;
  private hasValueChanged: boolean;

  constructor(activator: string, nextControlName: string, hasValueChanged: boolean) {
    this.activator = activator;
    this.nextControlName = nextControlName;
    this.hasValueChanged = hasValueChanged;
  }

}
