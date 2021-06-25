export class LinkedListNode<T> {

  public data: T;
  public next: LinkedListNode<T>;
  public prev: LinkedListNode<T>;

  public constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }

}
