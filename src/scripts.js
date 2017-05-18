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

Array.prototype.clone = function () {
  let i = this.length;
  let result = new Array(i);

  while (i--) {
    result[i] = this[i];
  }

  return result;
}

Array.prototype.pushAll = function (items) {
  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      this.push(items[i]);
    }
  }
}

Array.prototype.isEmpty = function () {
  return this.length === 0;
}

Array.prototype.remove = function (item) {
  let index = this.indexOf(item);
  if (index >= 0) {
    return this.splice(index, 1)[0];
  } else {
    return null;
  }
}

Number.zeroIfNull = function (value) {
  return value == null ? 0 : value;
}

Number.maxIfNull = function (value) {
  return value == null ? Number.MAX_VALUE : value;
}
