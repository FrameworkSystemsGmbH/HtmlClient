interface Array<T> {

  clone: () => Array<T>;

  pushAll: (items: Array<T>) => void;

  isEmpty: () => boolean;

  remove: (item: T) => T;

}
