class LinkedListNode<T> {

  private data: T;
  private next: LinkedListNode<T>;
  private prev: LinkedListNode<T>;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }

  public getData(): T {
    return this.data;
  }

  public getNext(): LinkedListNode<T> {
    return this.next;
  }

  public setNext(node: LinkedListNode<T>): void {
    this.next = node;
  }

  public getPrev(): LinkedListNode<T> {
    return this.prev;
  }

  public setPrev(node: LinkedListNode<T>): void {
    this.prev = node;
  }
}

export class SinglyLinkedList<T> {

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
    let currentNode = new LinkedListNode<T>(data);

    if (this.head === null || this.length === 0) {
      this.head = currentNode;
    } else {
      let node = this.head;

      while (node.getNext()) {
        node = node.getNext();
      }

      node.setNext(currentNode);
    }

    this.length++;
  }

  public remove(data: T): boolean {
    if (!data) {
      return false;
    }

    let index = this.indexOf(data);

    if (index === -1) {
      return false;
    }

    if (index === 0) {
      this.head = this.head.getNext();
    } else {
      let node = this.head;

      for (let i = 1; i < index; i++) {
        node = node.getNext();
      }

      node.setNext(node.getNext().getNext());
    }

    this.length--;

    return true;
  }

  public peek(): T {
    return this.length ? this.head.getData() : undefined;
  }

  public poll(): T {
    if (this.length) {
      let data = this.peek();
      this.remove(data);
      return data;
    } else {
      return undefined;
    }
  }

  public forEach(fn: (data: T) => void): void {
    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      fn.call(node.getData());
      node = node.getNext();
    }
  }

  public indexOf(data: T): number {
    if (!data) {
      return -1;
    }

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      if (node.getData() === data) {
        return i;
      }

      node = node.getNext();
    }

    return -1;
  }

  public contains(data: T): boolean {
    if (!data) {
      return false;
    }

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      if (node.getData() === data) {
        return true;
      }
      node = node.getNext();
    }

    return false;
  }

  public toArray(): Array<T> {
    let result: Array<T> = new Array<T>(this.length);

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      result.push(node.getData());
      node = node.getNext();
    }

    return result;
  }
}

export class DoublyLinkedList<T> {

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
    let currentNode = new LinkedListNode<T>(data);

    if (this.head === null || this.length === 0) {
      this.head = currentNode;
      this.tail = currentNode;
    } else {
      this.tail.setNext(currentNode);
      currentNode.setPrev(this.tail);
    }

    this.tail = currentNode;
    this.length++;
  }

  public remove(data: T): boolean {
    if (!data) {
      return false;
    }

    let index = this.indexOf(data);

    if (index === -1) {
      return false;
    }

    if (index === 0) {
      this.head = this.head.getNext();
      this.head.setPrev(null);
    } else {
      let node = this.head;

      for (let i = 1; i < index; i++) {
        node = node.getNext();
      }

      let deleteNode = node.getNext();
      node.setNext(deleteNode.getNext());
      deleteNode.getNext().setPrev(node);

      if (index === this.length - 1) {
        this.tail = node;
      }
    }

    this.length--;

    return true;
  }

  public peek(): T {
    return this.length ? this.head.getData() : undefined;
  }

  public poll(): T {
    if (this.length) {
      let data = this.peek();
      this.remove(data);
      return data;
    } else {
      return undefined;
    }
  }

  public forEach(fn: (data: T) => void): void {
    let node = this.head;

    while (node !== this.tail) {
      fn.call(this, node.getData());
      node = node.getNext();
    }
  }

  public indexOf(data: T): number {
    if (!data) {
      return -1;
    }

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      if (node.getData() === data) {
        return i;
      }

      node = node.getNext();
    }

    return -1;
  }

  public contains(data: T): boolean {
    if (!data) {
      return false;
    }

    let node = this.head;

    while (node !== this.tail) {
      if (node.getData() === data) {
        return true;
      }

      node = node.getNext();
    }

    return false;
  }

  public toArray(): Array<T> {
    let result: Array<T> = new Array<T>(this.length);

    let node = this.head;

    for (let i = 0; i < this.length; i++) {
      result.push(node.getData());
      node = node.getNext();
    }

    return result;
  }
}
