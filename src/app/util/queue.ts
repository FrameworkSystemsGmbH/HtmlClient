export class Queue<T> {

  private queue: Array<T> = new Array<T>();
  private offset: number = 0;

  public initialize(items: Array<T>) {
    this.queue = items;
    this.offset = 0;
  }

  public getLength(): number {
    return (this.queue.length - this.offset);
  }

  public isEmpty(): boolean {
    return !this.queue.length;
  }

  public enqueue(item: T): void {
    this.queue.push(item);
  }

  public dequeue(): T {

    if (this.isEmpty()) {
      return undefined;
    }

    let item: T = this.queue[this.offset];

    if (++this.offset * 2 >= this.queue.length) {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }

    return item;
  }

  public peek(): T {
    return !this.isEmpty() ? this.queue[this.offset] : undefined;
  }

  public toArray(): Array<T> {
    return this.queue.slice(this.offset);
  }

}
