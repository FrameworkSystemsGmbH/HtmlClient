import { ControlLabelWrapper } from '@app/wrappers/control-labels/control-label-wrapper';

const whitespaceRegEx: RegExp = /\s{1}/;

// Returns the number of identical chars from the left up to a whitespace
function startEqualsLength(s1: string, s2: string): number {
  if (!s1 || !s2) {
    return 0;
  }

  const length: number = Math.min(s1.length, s2.length);

  for (let i = 0; i < length; i++) {
    if (s1.charAt(i) !== s2.charAt(i)) {
      while (i > 0 && !whitespaceRegEx.test(s1.charAt(i - 1))) {
        i--;
      }
      return i;
    }
  }

  return length;
}

// Returns the number of identical chars from the right up to a whitespace
function endEqualsLength(s1: string, s2: string): number {
  if (!s1 || !s2) {
    return 0;
  }

  const l1: number = s1.length;
  const l2: number = s2.length;
  const length = Math.min(l1, l2);

  for (let i = 1; i <= length; i++) {
    if (s1.charAt(l1 - i) !== s2.charAt(l2 - i)) {
      i--;
      while (i > 0 && !whitespaceRegEx.test(s1.charAt(l1 - i))) {
        i--;
      }
      return i;
    }
  }

  return length;
}

export function optimizeLabels(labelWrappers: Array<ControlLabelWrapper>): void {
  // Check if there is anything to do
  if (!labelWrappers || !labelWrappers.length) {
    return;
  }

  // Check equality from left side
  let equalizedCaption: string = labelWrappers[0].getCaption();
  for (let i = 1; i < labelWrappers.length; i++) {
    const checkCaption: string = labelWrappers[i].getCaption();
    const length: number = startEqualsLength(equalizedCaption, checkCaption);
    if (length > 0) {
      equalizedCaption = equalizedCaption.substring(0, length);
    } else {
      equalizedCaption = null;
      break;
    }
  }

  // If equality from left side has been detected -> reduce captions
  if (equalizedCaption != null) {
    for (let i = 1; i < labelWrappers.length; i++) {
      const labelWrapper: ControlLabelWrapper = labelWrappers[i];
      const reducedCaption: string = labelWrapper.getCaption().substring(equalizedCaption.length);
      labelWrapper.setDisplayCaption(reducedCaption);
    }
  } else {
    // If no equality from left side has been detected -> check from right side
    equalizedCaption = labelWrappers[0].getCaption();
    for (let i = 1; i < labelWrappers.length; i++) {
      const checkCaption: string = labelWrappers[i].getCaption();
      const length: number = endEqualsLength(equalizedCaption, checkCaption);
      if (length > 0) {
        equalizedCaption = equalizedCaption.substring(equalizedCaption.length - length);
      } else {
        equalizedCaption = null;
        break;
      }
    }

    // If equality from right side has been detected -> reduce captions
    if (equalizedCaption != null) {
      for (let i = 0; i < labelWrappers.length - 1; i++) {
        const labelWrapper: ControlLabelWrapper = labelWrappers[i];
        const orgCaption: string = labelWrapper.getCaption();
        const reducedCaption: string = orgCaption.substring(0, orgCaption.length - length);
        labelWrapper.setDisplayCaption(reducedCaption);
      }
    }
  }
}
