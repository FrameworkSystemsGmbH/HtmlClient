export class ClientApplicationQuitEventArgs {

  protected restartRequested: boolean;

  constructor(restartRequested: boolean) {
    this.restartRequested = restartRequested;
  }

}
