function getWindow(): any {
  return window;
}

export class NativeService {

  public get window(): Window {
    return getWindow();
  }
}
