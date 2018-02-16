function serializer(replacer: (key: string, value: any) => any, cycleReplacer: (key: string, value: any) => any): any {
  const stack: Array<any> = new Array<any>();
  const keys: Array<any> = new Array<any>();

  if (cycleReplacer == null) {
    // tslint:disable-next-line:no-parameter-reassignment
    cycleReplacer = (key: any, value: any) => {
      if (stack[0] === value) {
        return '[Circular]';
      } else {
        return '[Circular.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
      }
    };
  }

  return function(key: string, value: any): any {
    if (stack.length > 0) {
      const thisPos: number = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) {
        // tslint:disable-next-line:no-parameter-reassignment
        value = cycleReplacer.call(this, key, value);
      }
    } else {
      stack.push(value);
    }
    return replacer == null ? value : replacer.call(this, key, value);
  };
}

if (!JSON.stringifyDecycle) {
  JSON.stringifyDecycle = (obj: any, replacer?: (key: string, value: any) => any, space?: number, cycleReplacer?: (key: string, value: any) => any) => {
    return JSON.stringify(obj, serializer(replacer, cycleReplacer), space);
  };
}
