export class ClientItemActivatedEventArgs {

  protected itemId: string;
  protected itemIndex: number;

  constructor(itemId: string, itemIndex: number) {
    this.itemId = itemId;
    this.itemIndex = itemIndex;
  }

}
