import { LinkedListNode } from './linked-list-node';

export class LinkedListTwoWay<T> {

  private length: number;
  private head: LinkedListNode<T>;
  private tail: LinkedListNode<T>;

  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }

  public getLength(): number {
    return this.length;
  }

  public add(data: T): void {
    const currentNode = new LinkedListNode<T>(data);

    if (this.head === null || this.length === 0) {
      this.head = currentNode;
      this.tail = currentNode;
    } else {
      this.tail.next = currentNode;
      currentNode.prev = this.tail;
    }

    this.tail = currentNode;
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
      this.head.prev = null;
    } else {
      let node = this.head;

      for (let i = 1; i < index; i++) {
        node = node.next;
      }

      const deleteNode = node.next;
      node.next = deleteNode.next;
      deleteNode.next.prev = node;

      if (index === this.length - 1) {
        this.tail = node;
      }
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

    while (node !== this.tail) {
      fn.call(this, node.data);
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

    while (node !== this.tail) {
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
      result.push(node.data);
      node = node.next;
    }

    return result;
  }
}
