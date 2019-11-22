if (!String.empty) {
  String.empty = function(): string {
    return '';
  };
}

if (!String.equals) {
  String.equals = function(x: string, y: string, ignoreCase: boolean): boolean {
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
  String.prototype.equals = function(other: string, ignoreCase: boolean): boolean {
    return String.equals(this, other, ignoreCase);
  };
}

if (!String.replaceAll) {
  String.replaceAll = function(str: string, search: string, replacement: string): string {
    if (str == null || search == null) {
      return str;
    }
    let actualReplacement: string = replacement;
    if (actualReplacement == null) {
      actualReplacement = '';
    }
    return str.split(search).join(replacement);
  };
}

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search: string, replacement: string): string {
    return String.replaceAll(this, search, replacement);
  };
}

if (!String.trimCharsLeft) {
  String.trimCharsLeft = function(str: string, chars: string): string {
    let trimChars: string = chars;
    if (trimChars === undefined) {
      trimChars = '\s';
    }
    return str.replace(new RegExp('^[' + trimChars + ']+'), '');
  };
}

if (!String.prototype.trimCharsLeft) {
  String.prototype.trimCharsLeft = function(chars: string): string {
    return String.trimCharsLeft(this, chars);
  };
}

if (!String.trimCharsRight) {
  String.trimCharsRight = function(str: string, chars: string): string {
    let trimChars: string = chars;
    if (trimChars === undefined) {
      trimChars = '\s';
    }
    return str.replace(new RegExp('[' + trimChars + ']+$'), '');
  };
}

if (!String.prototype.trimCharsRight) {
  String.prototype.trimCharsRight = function(chars: string): string {
    return String.trimCharsRight(this, chars);
  };
}

if (!String.trimChars) {
  String.trimChars = function(str: string, chars: string): string {
    return str.trimCharsLeft(chars).trimCharsRight(chars);
  };
}

if (!String.prototype.trimChars) {
  String.prototype.trimChars = function(chars: string): string {
    return String.trimChars(this, chars);
  };
}

if (!String.trimStringLeft) {
  String.trimStringLeft = function(str: string, trimStr: string): string {
    if (!str || trimStr == null) {
      return str;
    }

    const index: number = str.indexOf(trimStr);

    if (index === 0) {
      return str.substring(trimStr.length);
    } else {
      return str;
    }
  };
}

if (!String.prototype.trimStringLeft) {
  String.prototype.trimStringLeft = function(trimStr: string): string {
    return String.trimStringLeft(this, trimStr);
  };
}

if (!String.trimStringRight) {
  String.trimStringRight = function(str: string, trimStr: string): string {
    if (!str || trimStr == null) {
      return str;
    }

    const index: number = str.lastIndexOf(trimStr);

    if (index >= 0 && index === (str.length - trimStr.length)) {
      return str.substring(0, str.length - trimStr.length);
    } else {
      return str;
    }
  };
}

if (!String.prototype.trimStringRight) {
  String.prototype.trimStringRight = function(trimStr: string): string {
    return String.trimStringRight(this, trimStr);
  };
}

if (!String.trimString) {
  String.trimString = function(str: string, trimStr: string): string {
    return str.trimCharsLeft(trimStr).trimCharsRight(trimStr);
  };
}

if (!String.prototype.trimString) {
  String.prototype.trimString = function(trimStr: string): string {
    return String.trimString(this, trimStr);
  };
}

if (!String.isNullOrWhiteSpace) {
  String.isNullOrWhiteSpace = function(str: string): boolean {
    return str == null || str.trim() === String.empty();
  };
}
