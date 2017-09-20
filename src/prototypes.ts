/********************* String *********************/
if (!String.empty) {
  String.empty = function () {
    return '';
  };
}

if (!String.equals) {
  String.equals = function (x, y, ignoreCase) {
    if (x && y) {
      if (ignoreCase) {
        return x.toLowerCase() === y.toLowerCase();
      } else {
        return x === y;
      }
    } else if (!x && !y) {
      return x === y;
    }

    return false;
  };
}


if (!String.prototype.equals) {
  String.prototype.equals = function (other, ignoreCase) {
    return String.equals(this, other, ignoreCase);
  };
}

if (!String.trimCharsLeft) {
  String.trimCharsLeft = function (str, chars) {
    if (chars === undefined) {
      chars = '\s';
    }
    return str.replace(new RegExp('^[' + chars + ']+'), '');
  }
}

if (!String.prototype.trimCharsLeft) {
  String.prototype.trimCharsLeft = function (chars) {
    return String.trimCharsLeft(this, chars);
  }
}


if (!String.trimCharsRight) {
  String.trimCharsRight = function (str, chars) {
    if (chars === undefined) {
      chars = '\s';
    }
    return str.replace(new RegExp('[' + chars + ']+$'), '');
  }
}

if (!String.prototype.trimCharsRight) {
  String.prototype.trimCharsRight = function (chars) {
    return String.trimCharsRight(this, chars);
  }
}

if (!String.trimChars) {
  String.trimChars = function (str, chars) {
    return str.trimCharsLeft(chars).trimCharsRight(chars);
  }
}

if (!String.prototype.trimChars) {
  String.prototype.trimChars = function (chars) {
    return String.trimChars(this, chars);
  }
}

if (!String.trimStringLeft) {
  String.trimStringLeft = function (str, trimStr) {
    if (!str || trimStr == null) {
      return str;
    }

    let index = str.indexOf(trimStr);

    if (index === 0) {
      return str.substring(trimStr.length);
    } else {
      return str;
    }
  }
}

if (!String.prototype.trimStringLeft) {
  String.prototype.trimStringLeft = function (trimStr) {
    return String.trimStringLeft(this, trimStr);
  }
}


if (!String.trimStringRight) {
  String.trimStringRight = function (str, trimStr) {
    if (!str || trimStr == null) {
      return str;
    }

    let index = str.lastIndexOf(trimStr);

    if (index >= 0 && index === (str.length - trimStr.length)) {
      return str.substring(0, str.length - trimStr.length);
    } else {
      return str;
    }
  }
}

if (!String.prototype.trimStringRight) {
  String.prototype.trimStringRight = function (trimStr) {
    return String.trimStringRight(this, trimStr);
  }
}

if (!String.trimString) {
  String.trimString = function (str, trimStr) {
    return str.trimCharsLeft(trimStr).trimCharsRight(trimStr);
  }
}

if (!String.prototype.trimString) {
  String.prototype.trimString = function (trimStr) {
    return String.trimString(this, trimStr);
  }
}

if (!String.isNullOrWhiteSpace) {
  String.isNullOrWhiteSpace = function (str) {
    return !str || str.trim() === String.empty();
  }
}

/********************* Number *********************/
if (!Number.zeroIfNull) {
  Number.zeroIfNull = function (value) {
    return value == null ? 0 : value;
  }
}

if (!Number.maxIfNull) {
  Number.maxIfNull = function (value) {
    return value == null ? Number.MAX_SAFE_INTEGER : value;
  }
}

/********************* Boolean *********************/
if (!Boolean.trueIfNull) {
  Boolean.trueIfNull = function (value) {
    return value == null ? true : value;
  }
}

if (!Boolean.falseIfNull) {
  Boolean.falseIfNull = function (value) {
    return value == null ? false : value;
  }
}

if (!Boolean.nullIfTrue) {
  Boolean.nullIfTrue = function (value) {
    return value === true ? null : value;
  }
}

if (!Boolean.nullIfFalse) {
  Boolean.nullIfFalse = function (value) {
    return value === false ? null : value;
  }
}

/********************* Array *********************/
if (!Array.prototype.clone) {
  Array.prototype.clone = function () {
    let i = this.length;
    let result = new Array(i);

    while (i--) {
      result[i] = this[i];
    }

    return result;
  }
}

if (!Array.prototype.pushAll) {
  Array.prototype.pushAll = function (items) {
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        this.push(items[i]);
      }
    }
  }
}

if (!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function () {
    return this.length === 0;
  }
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function (item) {
    let index = this.indexOf(item);
    if (index >= 0) {
      return this.splice(index, 1)[0];
    } else {
      return null;
    }
  }
}

/********************* Math *********************/
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }

  value = +value;
  exp = +exp;

  // If the value is not a number or the exp is not an integer
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }

  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

  // Shift back
  value = value.toString().split('e');

  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

if (!Math.roundDec) {
  Math.roundDec = function (value, exp) {
    return decimalAdjust('round', value, exp);
  };
}

if (!Math.floorDec) {
  Math.floorDec = function (value, exp) {
    return decimalAdjust('floor', value, exp);
  };
}

if (!Math.ceilDec) {
  Math.ceilDec = function (value, exp) {
    return decimalAdjust('ceil', value, exp);
  };
}
