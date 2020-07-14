// tslint:disable: only-arrow-functions

if (!Number.zeroIfNull) {
  Number.zeroIfNull = function(value: number): number {
    return value == null ? 0 : value;
  };
}

if (!Number.maxIfNull) {
  Number.maxIfNull = function(value: number): number {
    return value == null ? Number.MAX_SAFE_INTEGER : value;
  };
}
