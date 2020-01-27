export class ClientSelectedTabPageChangedEventArgs {

  protected lastTab: string;
  protected selectedTab: string;

  constructor(lastTab: string, selectedTab: string) {
    this.lastTab = lastTab;
    this.selectedTab = selectedTab;
  }
}
