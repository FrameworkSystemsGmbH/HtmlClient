function decimalAdjust(type: string, value: number, exp: number) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }

  const expNum: number = +exp;

  let valueNum: number = +value;

  // If the value is not a number or the exp is not an integer
  if (isNaN(valueNum) || !(typeof expNum === 'number' && expNum % 1 === 0)) {
    return NaN;
  }

  // Shift
  let valueArr: Array<string> = value.toString().split('e');
  valueNum = Math[type](+(valueArr[0] + 'e' + (valueArr[1] ? (+valueArr[1] - expNum) : -expNum)));

  // Shift back
  valueArr = valueNum.toString().split('e');

  return +(valueArr[0] + 'e' + (valueArr[1] ? (+valueArr[1] + expNum) : expNum));
}

if (!Math.roundDec) {
  Math.roundDec = (value: number, exp: number) => {
    return decimalAdjust('round', value, exp);
  };
}

if (!Math.floorDec) {
  Math.floorDec = (value: number, exp: number) => {
    return decimalAdjust('floor', value, exp);
  };
}

if (!Math.ceilDec) {
  Math.ceilDec = (value: number, exp: number) => {
    return decimalAdjust('ceil', value, exp);
  };
}
