import { LinkedListNode } from '@app/util/linked-list-node';

export class LinkedListOneWay<T> {

  private _length: number;
  private _head: LinkedListNode<T> | null;

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
    const currentNode: LinkedListNode<T> = new LinkedListNode<T>(data);

    if (this._head === null || this._length === 0) {
      this._head = currentNode;
    } else {
      let node: LinkedListNode<T> = this._head;

      while (node.next) {
        node = node.next;
      }

      node.next = currentNode;
    }

    this._length++;
  }

  public remove(data: T): boolean {
    const index = this.indexOf(data);

    if (index === -1) {
      return false;
    }

    if (index === 0) {
      this._head = this._head ? this._head.next : null;
    } else {
      let node: LinkedListNode<T> | null = this._head;

      for (let i = 1; i < index; i++) {
        node = node ? node.next : null;
      }

      if (node) {
        node.next = node.next ? node.next.next : null;
      }
    }

    this._length--;

    return true;
  }

  public peek(): T | null {
    return this._length && this._head ? this._head.data : null;
  }

  public poll(): T | null {
    if (this._length) {
      const data = this.peek();
      if (data) {
        this.remove(data);
      }
      return data;
    } else {
      return null;
    }
  }

  public forEach(fn: (data: T) => void): void {
    let node: LinkedListNode<T> | null = this._head;

    for (let i = 0; i < this._length; i++) {
      if (node != null) {
        fn.call(this, node.data);
        node = node.next;
      }
    }
  }

  public indexOf(data: T): number {
    if (!data) {
      return -1;
    }

    let node: LinkedListNode<T> | null = this._head;

    for (let i = 0; i < this._length; i++) {
      if (node) {
        if (node.data === data) {
          return i;
        }
        node = node.next;
      }
    }

    return -1;
  }

  public contains(data: T): boolean {
    if (!data) {
      return false;
    }

    let node: LinkedListNode<T> | null = this._head;

    for (let i = 0; i < this._length; i++) {
      if (node) {
        if (node.data === data) {
          return true;
        }
        node = node.next;
      }
    }

    return false;
  }

  public toArray(): Array<T> {
    const result: Array<T> = new Array<T>(this._length);

    let node: LinkedListNode<T> | null = this._head;

    for (let i = 0; i < this._length; i++) {
      if (node) {
        result[i] = node.data;
        node = node.next;
      }
    }

    return result;
  }
}
