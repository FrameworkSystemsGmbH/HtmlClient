function getWindow(): any {
  return window;
}

export class WindowRefService {

  public get nativeWindow(): Window {
    return getWindow();
  }
}
