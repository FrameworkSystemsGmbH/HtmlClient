export class ClientApplicationQuitEventArgs {

  protected restartRequested: boolean;

  public constructor(restartRequested: boolean) {
    this.restartRequested = restartRequested;
  }
}
