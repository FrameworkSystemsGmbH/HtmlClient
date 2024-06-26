export function getViewportWidth(): number {
  return document.body.clientWidth;
}

export function getViewportHeight(): number {
  return document.body.clientHeight;
}

export interface IScrollOptions {
  center?: boolean;
  offset?: number;
}

const DEFAULT_SCROLL_OPTIONS: IScrollOptions = {
  center: false,
  offset: 5
};

/**
 * Normalerweise funktioniert das recht gut an DOM-Objekten selbst (der Browser kann das selbst),
 *  aber nicht, wenn eine Keyboard in Android angezeigt wird. Dann stimmen die Values nicht.
 * DOM Element wird in die View gescrolled.
 */
export function scrollIntoView(container: HTMLElement, child: HTMLElement, scrollOptions?: IScrollOptions): void {
  const options: IScrollOptions = { ...DEFAULT_SCROLL_OPTIONS, ...scrollOptions };

  const contStyles: CSSStyleDeclaration = getComputedStyle(container);
  const childStyles: CSSStyleDeclaration = getComputedStyle(child);

  const contRect: ClientRect = container.getBoundingClientRect();
  const contBorderTopValue: string = contStyles.borderTopWidth;
  const contBorderTop: number = contBorderTopValue ? parseFloat(contBorderTopValue) : 0;
  const contHeight: number = container.clientHeight;
  const contTop: number = contRect.top + contBorderTop;

  const childRect: ClientRect = child.getBoundingClientRect();
  const childMarginTopValue: string = childStyles.marginTop;
  const childMarginTop: number = childMarginTopValue ? parseFloat(childMarginTopValue) : 0;
  const childMarginBottomValue: string = childStyles.marginBottom;
  const childMarginBottom: number = childMarginBottomValue ? parseFloat(childMarginBottomValue) : 0;
  const childHeight = child.offsetHeight + childMarginTop + childMarginBottom;
  const childTop: number = childRect.top - childMarginTop;

  const offset = document.body.scrollTop + childTop - (document.body.scrollTop + contTop);
  const scroll = container.scrollTop;

  if (options.center) {
    if (offset + childHeight / 2 < contHeight / 2) {
      container.scrollTop = scroll + offset - contHeight / 2 + childHeight / 2;
    } else {
      container.scrollTop = scroll + offset - contHeight + childHeight + contHeight / 2 - childHeight / 2;
    }
  } else if (offset < 0) {
    container.scrollTop = scroll + offset - (options.offset != null && options.offset > 0 ? options.offset : 0);
  } else if (offset + childHeight > contHeight) {
    container.scrollTop = scroll + offset - contHeight + childHeight + (options.offset != null && options.offset > 0 ? options.offset : 0);
  }
}

/** Für InputFelder, weil dort selektiert wird. */
export function setSelection(input: any, start?: any, end?: any): void {
  let selStart = start;
  let selEnd = end;

  if (selStart == null) {
    selStart = 0;
  }

  if (selEnd == null) {
    selEnd = input.value.length;
  }

  if (input.createTextRange) {
    const selRange = input.createTextRange();
    selRange.collapse(true);
    selRange.moveStart('character', selStart);
    selRange.moveEnd('character', selEnd - selStart);
    selRange.select();
  } else if (input.setSelectionRange) {
    input.setSelectionRange(selStart, selEnd);
  } else if (typeof input.selectionStart !== 'undefined') {
    input.selectionStart = selStart;
    input.selectionEnd = selEnd;
  }
}

export function isDescendant(container: HTMLElement, element: HTMLElement): boolean {
  return container.contains(element);
}

export function isDescentantOrSelf(container: HTMLElement, element: HTMLElement): boolean {
  return container === element || isDescendant(container, element);
}

export function isInClass(element: HTMLElement, className: string): boolean {
  if (element.classList.contains(className)) {
    return true;
  } else if (element.parentElement) {
    return isInClass(element.parentElement, className);
  }

  return false;
}

export function getNearestParent(element: HTMLElement, className: string): HTMLElement | null {
  const parent: HTMLElement | null = element.parentElement;

  if (!parent) {
    return null;
  }

  if (parent.classList.contains(className)) {
    return parent;
  } else {
    return getNearestParent(parent, className);
  }
}
