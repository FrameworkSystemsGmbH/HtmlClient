if (!Boolean.trueIfNull) {
  Boolean.trueIfNull = value => {
    return value == null ? true : value;
  };
}

if (!Boolean.falseIfNull) {
  Boolean.falseIfNull = value => {
    return value == null ? false : value;
  };
}

if (!Boolean.nullIfTrue) {
  Boolean.nullIfTrue = value => {
    return value === true ? null : value;
  };
}

if (!Boolean.nullIfFalse) {
  Boolean.nullIfFalse = value => {
    return value === false ? null : value;
  };
}
