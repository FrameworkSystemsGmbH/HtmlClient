if (!Boolean.trueIfNull) {
  Boolean.trueIfNull = function(value) {
    return value == null ? true : value;
  };
}

if (!Boolean.falseIfNull) {
  Boolean.falseIfNull = function(value) {
    return value == null ? false : value;
  };
}

if (!Boolean.nullIfTrue) {
  Boolean.nullIfTrue = function(value) {
    return value === true ? null : value;
  };
}

if (!Boolean.nullIfFalse) {
  Boolean.nullIfFalse = function(value) {
    return value === false ? null : value;
  };
}
