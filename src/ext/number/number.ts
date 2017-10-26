if (!Number.zeroIfNull) {
  Number.zeroIfNull = function(value) {
    return value == null ? 0 : value;
  };
}

if (!Number.maxIfNull) {
  Number.maxIfNull = function(value) {
    return value == null ? Number.MAX_SAFE_INTEGER : value;
  };
}
