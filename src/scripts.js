String.equals = function (x, y, ignoreCase) {
  if (x && y) {
    if (ignoreCase) {
      return x.toUpperCase() === y.toUpperCase();
    } else {
      return x === y;
    }
  } else if (!x && !y) {
    return x === y;
  }
  return false;
};

String.prototype.equals = function (other, ignoreCase) {
  return String.equals(this, other, ignoreCase);
};
