// tslint:disable: only-arrow-functions

if (!Boolean.trueIfNull) {
  Boolean.trueIfNull = function(value: boolean): boolean {
    return value == null ? true : value;
  };
}

if (!Boolean.falseIfNull) {
  Boolean.falseIfNull = function(value: boolean): boolean {
    return value == null ? false : value;
  };
}

if (!Boolean.nullIfTrue) {
  Boolean.nullIfTrue = function(value: boolean): boolean {
    return value === true ? null : value;
  };
}

if (!Boolean.nullIfFalse) {
  Boolean.nullIfFalse = function(value: boolean): boolean {
    return value === false ? null : value;
  };
}
