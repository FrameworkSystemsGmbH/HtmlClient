import { LinkedListNode } from '@app/util/linked-list-node';

export class LinkedListOneWay<T> {

  private length: number;
  private head: LinkedListNode<T>;

  constructor() {
    this.length = 0;
    this.head = null;
  }

  public getLength(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return !this.length;
  }

  public add(data: T): void {
    const currentNode = new LinkedListNode<T>(data);

    if (this.head === null || this.length === 0) {
      this.head = currentNode;
    } else {
      let node = this.head;

      while (node.next) {
        node = node.next;
      }

      node.next = currentNode;
    }

    this.length++;
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
      this.head = this.head.next;
    } else {
      let node = this.head;

      for (let i = 1; i < index; i++) {
        node = node.next;
      }

      node.next = node.next.next;
    }

    this.length--;

    return true;
  }

  public peek(): T {
    return this.length ? this.head.data : undefined;
  }

  public poll(): T {
    if (this.length) {
      const data = this.peek();
      this.remove(data);
      return data;
    } else {
      return undefined;
    }
  }

  public forEach(fn: (data: T) => void): void {
    let node = this.head;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.length; i++) {
      fn.call(node.data);
      node = node.next;
    }
  }

  public indexOf(data: T): number {
    if (!data) {
      return -1;
    }

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
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

    let node = this.head;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.length; i++) {
      if (node.data === data) {
        return true;
      }
      node = node.next;
    }

    return false;
  }

  public toArray(): Array<T> {
    const result: Array<T> = new Array<T>(this.length);

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      result[i] = node.data;
      node = node.next;
    }

    return result;
  }
}
