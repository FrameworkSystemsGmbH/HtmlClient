if (!Number.zeroIfNull) {
  Number.zeroIfNull = value => {
    return value == null ? 0 : value;
  };
}

if (!Number.maxIfNull) {
  Number.maxIfNull = value => {
    return value == null ? Number.MAX_SAFE_INTEGER : value;
  };
}
