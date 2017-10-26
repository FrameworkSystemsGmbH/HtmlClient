// tslint:disable:interface-name
interface Array<T> {

  clone(): Array<T>;

  pushAll(items: Array<T>);

  isEmpty(): boolean;

  remove(item: T): T;

}
