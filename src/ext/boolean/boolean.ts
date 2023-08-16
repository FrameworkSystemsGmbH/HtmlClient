Boolean.trueIfNull = function (value: boolean | null | undefined): boolean {
  return value ?? true;
};

Boolean.falseIfNull = function (value: boolean | null | undefined): boolean {
  return value ?? false;
};

Boolean.nullIfTrue = function (value: boolean): boolean | null {
  return value ? null : value;
};

Boolean.nullIfFalse = function (value: boolean): boolean | null {
  return !value ? null : value;
};
