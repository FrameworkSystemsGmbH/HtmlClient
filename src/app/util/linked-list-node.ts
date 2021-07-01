export class LinkedListNode<T> {

  public data: T;
  public next: LinkedListNode<T> | null;
  public prev: LinkedListNode<T> | null;

  public constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }

}
