export class Queue<T> {

  private _queue: Array<T> = new Array<T>();
  private _offset: number = 0;

  public initialize(items: Array<T>): void {
    this._queue = items;
    this._offset = 0;
  }

  public getLength(): number {
    return this._queue.length - this._offset;
  }

  public isEmpty(): boolean {
    return !this._queue.length;
  }

  public enqueue(item: T): void {
    this._queue.push(item);
  }

  public dequeue(): T {

    if (this.isEmpty()) {
      return undefined;
    }

    const item: T = this._queue[this._offset];

    if (++this._offset * 2 >= this._queue.length) {
      this._queue = this._queue.slice(this._offset);
      this._offset = 0;
    }

    return item;
  }

  public peek(): T {
    return !this.isEmpty() ? this._queue[this._offset] : undefined;
  }

  public toArray(): Array<T> {
    return this._queue.slice(this._offset);
  }

}
