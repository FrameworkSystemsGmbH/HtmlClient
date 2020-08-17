// tslint:disable: deprecation
// Old browsers (including the Android 6 WebView) do not provide the new 'event.key' property
// These browsers need to fall back to the deprecated 'event.keyCode' property
export function getKeyString(event: KeyboardEvent): string {
  if (event == null) {
    return 'Unknown';
  }

  if (event.key === 'Enter' || event.keyCode === 13) {
    return 'Enter';
  }

  if (event.key === 'Tab' || event.keyCode === 9) {
    return 'Tab';
  }

  if (event.key === 'Escape' || event.keyCode === 27) {
    return 'Escape';
  }

  if (event.key === 'F2' || event.keyCode === 113) {
    return 'F2';
  }

  if (event.key === 'ArrowLeft' || event.keyCode === 37) {
    return 'ArrowLeft';
  }

  if (event.key === 'ArrowRight' || event.keyCode === 39) {
    return 'ArrowRight';
  }

  if (event.key === 'ArrowUp' || event.keyCode === 38) {
    return 'ArrowUp';
  }

  if (event.key === 'ArrowDown' || event.keyCode === 40) {
    return 'ArrowDown';
  }

  return event.key;
}
