function decimalAdjust(calc: (val: number) => number, value: number, exp: number): number {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || Number(exp) === 0) {
    return calc(value);
  }

  const expNum: number = Number(exp);

  let valueNum: number = Number(value);

  // If the value is not a number or the exp is not an integer
  if (isNaN(valueNum) || !(typeof expNum === 'number' && expNum % 1 === 0)) {
    return NaN;
  }

  // Shift
  let valueArr: Array<string> = value.toString().split('e');
  valueNum = calc(Number(`${valueArr[0]}e${valueArr[1] ? Number(valueArr[1]) - expNum : -expNum}`));

  // Shift back
  valueArr = valueNum.toString().split('e');

  return Number(`${valueArr[0]}e${valueArr[1] ? Number(valueArr[1]) + expNum : expNum}`);
}

Math.roundDec = function (value: number, exp: number): number {
  return decimalAdjust(Math.round.bind(this), value, exp);
};

Math.floorDec = function (value: number, exp: number): number {
  return decimalAdjust(Math.floor.bind(this), value, exp);
};

Math.ceilDec = function (value: number, exp: number): number {
  return decimalAdjust(Math.ceil.bind(this), value, exp);
};
