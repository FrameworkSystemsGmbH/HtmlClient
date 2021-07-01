Boolean.trueIfNull = function (value: boolean | null | undefined): boolean {
  return value == null ? true : value;
};

Boolean.falseIfNull = function (value: boolean | null | undefined): boolean {
  return value == null ? false : value;
};

Boolean.nullIfTrue = function (value: boolean): boolean | null {
  return value ? null : value;
};

Boolean.nullIfFalse = function (value: boolean): boolean | null {
  return !value ? null : value;
};
