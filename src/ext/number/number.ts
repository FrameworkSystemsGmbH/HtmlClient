Number.zeroIfNull = function (value: number | null | undefined): number {
  return value == null ? 0 : value;
};

Number.maxIfNull = function (value: number | null | undefined): number {
  return value == null ? Number.MAX_SAFE_INTEGER : value;
};
