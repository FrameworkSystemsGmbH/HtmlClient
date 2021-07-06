interface Array<T> {

  clone: () => Array<T>;

  pushAll: (items: Array<T>) => void;

  remove: (item: T) => T;

}
