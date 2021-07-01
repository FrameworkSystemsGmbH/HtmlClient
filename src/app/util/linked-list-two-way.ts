import { LinkedListNode } from '@app/util/linked-list-node';

export class LinkedListTwoWay<T> {

  private _length: number;
  private _head: LinkedListNode<T> | null;
  private _tail: LinkedListNode<T> | null;

  public constructor() {
    this._length = 0;
    this._head = null;
    this._tail = null;
  }

  public getLength(): number {
    return this._length;
  }

  public add(data: T): void {
    const currentNode: LinkedListNode<T> = new LinkedListNode<T>(data);

    if (this._head === null || this._length === 0) {
      this._head = currentNode;
      this._tail = currentNode;
    } else if (this._tail) {
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

    const index: number = this.indexOf(data);

    if (index === -1) {
      return false;
    }

    if (index === 0) {
      this._head = this._head ? this._head.next : null;
      if (this._head) {
        this._head.prev = null;
      }
    } else {
      let node: LinkedListNode<T> | null = this._head;

      for (let i = 1; i < index; i++) {
        node = node ? node.next : null;
      }

      if (node) {
        const deleteNode: LinkedListNode<T> | null = node.next;
        node.next = deleteNode ? deleteNode.next : null;
        if (deleteNode && deleteNode.next) {
          deleteNode.next.prev = node;
        }
      }

      if (index === this._length - 1) {
        this._tail = node;
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
      const data: T | null = this.peek();
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

    while (node !== this._tail) {
      if (node) {
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

    while (node !== this._tail) {
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

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this._length; i++) {
      if (node) {
        result.push(node.data);
        node = node.next;
      }
    }

    return result;
  }
}
