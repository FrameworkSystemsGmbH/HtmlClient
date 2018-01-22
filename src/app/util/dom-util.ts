export namespace DomUtil {

  export function getViewportWidth(): number {
    return document.body.clientWidth;
  }

  export function getViewportHeight(): number {
    return document.body.clientHeight;
  }

  export function scrollIntoView(container: HTMLElement, child: HTMLElement) {
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

    const offset = (document.body.scrollTop + childTop) - (document.body.scrollTop + contTop);
    const scroll = container.scrollTop;

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if ((offset + childHeight) > contHeight) {
      container.scrollTop = scroll + offset - contHeight + childHeight;
    }
  }

  export function setSelection(input: any, start, end) {
    if (input.createTextRange) {
      const selRange = input.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end - start);
      selRange.select();
    } else if (input.setSelectionRange) {
      input.setSelectionRange(start, end);
    } else if (typeof input.selectionStart !== 'undefined') {
      input.selectionStart = start;
      input.selectionEnd = end;
    }
  }

  export function isDescendant(container: HTMLElement, element: HTMLElement): boolean {
    if (!container || !element) { return false; }
    return container.contains(element);
  }

  export function isDescentantOrSelf(container: HTMLElement, element: HTMLElement): boolean {
    if (!container || !element) { return false; }
    return container === element || isDescendant(container, element);
  }
}
