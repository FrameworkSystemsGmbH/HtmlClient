if (!String.empty) {
  String.empty = function() {
    return '';
  };
}

if (!String.equals) {
  String.equals = function(x, y, ignoreCase) {
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
  String.prototype.equals = function(other, ignoreCase) {
    return String.equals(this, other, ignoreCase);
  };
}

if (!String.trimCharsLeft) {
  String.trimCharsLeft = function(str, chars) {
    let trimChars: string = chars;
    if (trimChars === undefined) {
      trimChars = '\s';
    }
    return str.replace(new RegExp('^[' + trimChars + ']+'), '');
  };
}

if (!String.prototype.trimCharsLeft) {
  String.prototype.trimCharsLeft = function(chars) {
    return String.trimCharsLeft(this, chars);
  };
}

if (!String.trimCharsRight) {
  String.trimCharsRight = (str, chars) => {
    let trimChars: string = chars;
    if (trimChars === undefined) {
      trimChars = '\s';
    }
    return str.replace(new RegExp('[' + trimChars + ']+$'), '');
  };
}

if (!String.prototype.trimCharsRight) {
  String.prototype.trimCharsRight = function(chars) {
    return String.trimCharsRight(this, chars);
  };
}

if (!String.trimChars) {
  String.trimChars = function(str, chars) {
    return str.trimCharsLeft(chars).trimCharsRight(chars);
  };
}

if (!String.prototype.trimChars) {
  String.prototype.trimChars = function(chars) {
    return String.trimChars(this, chars);
  };
}

if (!String.trimStringLeft) {
  String.trimStringLeft = function(str, trimStr) {
    if (!str || trimStr == null) {
      return str;
    }

    const index = str.indexOf(trimStr);

    if (index === 0) {
      return str.substring(trimStr.length);
    } else {
      return str;
    }
  };
}

if (!String.prototype.trimStringLeft) {
  String.prototype.trimStringLeft = function(trimStr) {
    return String.trimStringLeft(this, trimStr);
  };
}

if (!String.trimStringRight) {
  String.trimStringRight = function(str, trimStr) {
    if (!str || trimStr == null) {
      return str;
    }

    const index = str.lastIndexOf(trimStr);

    if (index >= 0 && index === (str.length - trimStr.length)) {
      return str.substring(0, str.length - trimStr.length);
    } else {
      return str;
    }
  };
}

if (!String.prototype.trimStringRight) {
  String.prototype.trimStringRight = function(trimStr) {
    return String.trimStringRight(this, trimStr);
  };
}

if (!String.trimString) {
  String.trimString = function(str, trimStr) {
    return str.trimCharsLeft(trimStr).trimCharsRight(trimStr);
  };
}

if (!String.prototype.trimString) {
  String.prototype.trimString = function(trimStr) {
    return String.trimString(this, trimStr);
  };
}

if (!String.isNullOrWhiteSpace) {
  String.isNullOrWhiteSpace = function(str) {
    return !str || str.trim() === String.empty();
  };
}
