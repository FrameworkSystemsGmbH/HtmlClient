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
