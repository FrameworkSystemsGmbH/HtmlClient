Array.prototype.clone = function (): Array<unknown> {
  let i = this.length;
  const result = new Array<unknown>(i);
  while (i--) {
    result[i] = this[i];
  }

  return result;
};

Array.prototype.pushAll = function (items: Array<unknown>): void {
  if (items.length > 0) {
    for (const item of items) {
      this.push(item);
    }
  }
};

Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.remove = function (item: unknown): unknown {
  const index = this.indexOf(item);
  if (index >= 0) {
    return this.splice(index, 1)[0] as unknown;
  } else {
    return null;
  }
};
