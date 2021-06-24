String.empty = function (): string {
  return '';
};

String.isNullOrWhiteSpace = function (str: string | undefined): boolean {
  return str == null || str.trim() === String.empty();
};

String.equals = function (x: string, y: string, ignoreCase: boolean): boolean {
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

String.prototype.equals = function (other: string, ignoreCase: boolean): boolean {
  return String.equals(this.toString(), other, ignoreCase);
};

String.replaceAll = function (str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
};

String.prototype.replaceAll = function (search: string, replacement: string): string {
  return String.replaceAll(this.toString(), search, replacement);
};

String.trimCharsLeft = function (str: string, chars: string): string {
  return str.replace(new RegExp(`^[${chars}]+`, 'u'), '');
};

String.prototype.trimCharsLeft = function (chars: string): string {
  return String.trimCharsLeft(this.toString(), chars);
};

String.trimCharsRight = function (str: string, chars: string): string {
  return str.replace(new RegExp(`[${chars}]+$`, 'u'), '');
};

String.prototype.trimCharsRight = function (chars: string): string {
  return String.trimCharsRight(this.toString(), chars);
};

String.trimChars = function (str: string, chars: string): string {
  return str.trimCharsLeft(chars).trimCharsRight(chars);
};

String.prototype.trimChars = function (chars: string): string {
  return String.trimChars(this.toString(), chars);
};

String.trimStringLeft = function (str: string, trimStr: string): string {
  const index: number = str.indexOf(trimStr);

  if (index === 0) {
    return str.substring(trimStr.length);
  } else {
    return str;
  }
};

String.prototype.trimStringLeft = function (trimStr: string): string {
  return String.trimStringLeft(this.toString(), trimStr);
};

String.trimStringRight = function (str: string, trimStr: string): string {
  const index: number = str.lastIndexOf(trimStr);

  if (index >= 0 && index === str.length - trimStr.length) {
    return str.substring(0, str.length - trimStr.length);
  } else {
    return str;
  }
};

String.prototype.trimStringRight = function (trimStr: string): string {
  return String.trimStringRight(this.toString(), trimStr);
};

String.trimString = function (str: string, trimStr: string): string {
  return str.trimCharsLeft(trimStr).trimCharsRight(trimStr);
};

String.prototype.trimString = function (trimStr: string): string {
  return String.trimString(this.toString(), trimStr);
};
