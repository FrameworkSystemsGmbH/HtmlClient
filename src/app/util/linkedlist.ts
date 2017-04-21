class LinkedListNode<T> {

    private _data: T;
    private _next: LinkedListNode<T>;
    private _prev: LinkedListNode<T>;

    constructor(data: T) {
        this._data = data;
        this._next = null;
        this._prev = null;
    }

    public get data(): T {
        return this._data;
    }

    public get next(): LinkedListNode<T> {
        return this._next;
    }

    public set next(node: LinkedListNode<T>) {
        this._next = node;
    }

    public get prev(): LinkedListNode<T> {
        return this._prev;
    }

    public set prev(node: LinkedListNode<T>) {
        this._prev = node;
    }
}

export class SinglyLinkedList<T> {

    private _length: number;
    private _head: LinkedListNode<T>;

    constructor() {
        this._length = 0;
        this._head = null;
    }

    public get length(): number {
        return this._length;
    }

    public isEmpty(): boolean {
        return !this._length;
    }

    public add(data: T): void {
        let currentNode = new LinkedListNode<T>(data);
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

        let index = this.indexOf(data);

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
        return this.length ? this._head.data : undefined;
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
        let node = this._head;

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

        for (let i = 0; i < this._length; i++) {
            if (node.data === data) {
                return true;
            }
            node = node.next;
        }

        return false;
    }

    public toArray(): Array<T> {
        let result: Array<T> = new Array<T>(this._length);

        let node = this._head;

        for (let i = 0; i < this._length; i++) {
            result.push(node.data);
            node = node.next;
        }

        return result;
    }
}

export class DoublyLinkedList<T> {

    private _length: number;
    private _head: LinkedListNode<T>;
    private _tail: LinkedListNode<T>;

    constructor() {
        this._length = 0;
        this._head = null;
        this._tail = null;
    }

    public get length(): number {
        return this._length;
    }

    public add(data: T): void {
        let currentNode = new LinkedListNode<T>(data);

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

        let index = this.indexOf(data);

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

            let deleteNode = node.next;
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
        return this.length ? this._head.data : undefined;
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
        let result: Array<T> = new Array<T>(this._length);

        let node = this._head;

        for (let i = 0; i < this._length; i++) {
            result.push(node.data);
            node = node.next;
        }

        return result;
    }
}
