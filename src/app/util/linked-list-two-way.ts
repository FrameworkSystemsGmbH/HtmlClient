import { LinkedListNode } from '@app/util/linked-list-node';

export class LinkedListTwoWay<T> {

  private _length: number;
  private _head: LinkedListNode<T>;
  private _tail: LinkedListNode<T>;

  public constructor() {
    this._length = 0;
    this._head = null;
    this._tail = null;
  }

  public getLength(): number {
    return this._length;
  }

  public add(data: T): void {
    const currentNode = new LinkedListNode<T>(data);

    if (this._head === null || this._length === 0) {
      this._head = currentNode;
      this._tail = currentNode;
    } else {
      this._tail.next = currentNode;
      currentNode.prev = this._tail;
    }

    this._tail = currentNode;
    this._length++;
  }

  public remove(data: T): boolean {
    if (!data) {
      return false;
    }

    const index = this.indexOf(data);

    if (index === -1) {
      return false;
    }

    if (index === 0) {
      this._head = this._head.next;
      this._head.prev = null;
    } else {
      let node = this._head;

      for (let i = 1; i < index; i++) {
        node = node.next;
      }

      const deleteNode = node.next;
      node.next = deleteNode.next;
      deleteNode.next.prev = node;

      if (index === this._length - 1) {
        this._tail = node;
      }
    }

    this._length--;

    return true;
  }

  public peek(): T {
    return this._length ? this._head.data : undefined;
  }

  public poll(): T {
    if (this._length) {
      const data = this.peek();
      this.remove(data);
      return data;
    } else {
      return undefined;
    }
  }

  public forEach(fn: (data: T) => void): void {
    let node = this._head;

    while (node !== this._tail) {
      fn.call(this, node.data);
      node = node.next;
    }
  }

  public indexOf(data: T): number {
    if (!data) {
      return -1;
    }

    let node = this._head;

    for (let i = 0; i < this._length; i++) {
      if (node.data === data) {
        return i;
      }

      node = node.next;
    }

    return -1;
  }

  public contains(data: T): boolean {
    if (!data) {
      return false;
    }

    let node = this._head;

    while (node !== this._tail) {
      if (node.data === data) {
        return true;
      }

      node = node.next;
    }

    return false;
  }

  public toArray(): Array<T> {
    const result: Array<T> = new Array<T>(this._length);

    let node = this._head;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this._length; i++) {
      result.push(node.data);
      node = node.next;
    }

    return result;
  }
}
