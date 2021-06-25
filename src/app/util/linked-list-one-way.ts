import { LinkedListNode } from '@app/util/linked-list-node';

export class LinkedListOneWay<T> {

  private _length: number;
  private _head: LinkedListNode<T>;

  public constructor() {
    this._length = 0;
    this._head = null;
  }

  public getLength(): number {
    return this._length;
  }

  public isEmpty(): boolean {
    return !this._length;
  }

  public add(data: T): void {
    const currentNode = new LinkedListNode<T>(data);

    if (this._head === null || this._length === 0) {
      this._head = currentNode;
    } else {
      let node = this._head;

      while (node.next) {
        node = node.next;
      }

      node.next = currentNode;
    }

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
    } else {
      let node = this._head;

      for (let i = 1; i < index; i++) {
        node = node.next;
      }

      node.next = node.next.next;
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

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this._length; i++) {
      fn.call(node.data);
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

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this._length; i++) {
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

    for (let i = 0; i < this._length; i++) {
      result[i] = node.data;
      node = node.next;
    }

    return result;
  }
}
