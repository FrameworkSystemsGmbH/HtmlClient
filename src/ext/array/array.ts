if (!Array.prototype.clone) {
  Array.prototype.clone = function() {
    let i = this.length;
    const result = new Array(i);

    while (i--) {
      result[i] = this[i];
    }

    return result;
  };
}

if (!Array.prototype.pushAll) {
  Array.prototype.pushAll = function(items) {
    if (items && items.length) {
      for (const item of items) {
        this.push(item);
      }
    }
  };
}

if (!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function() {
    return this.length === 0;
  };
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function(item) {
    const index = this.indexOf(item);
    if (index >= 0) {
      return this.splice(index, 1)[0];
    } else {
      return null;
    }
  };
}
