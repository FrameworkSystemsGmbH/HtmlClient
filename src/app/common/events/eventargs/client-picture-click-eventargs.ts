export class ClientPictureClickEventArgs {

  protected button: number;
  protected clickCount: number;
  protected pictureWidth: number;
  protected pictureHeight: number;
  protected picturePointX: number;
  protected picturePointY: number;
  protected controlPointX: number;
  protected controlPointY: number;

  constructor(button: number, clickCount: number, pictureWidth: number, pictureHeight: number, picturePointX: number, picturePointY: number, controlPointX: number, controlPointY: number) {
    this.button = button;
    this.clickCount = clickCount;
    this.pictureWidth = pictureWidth;
    this.pictureHeight = pictureHeight;
    this.picturePointX = picturePointX;
    this.picturePointY = picturePointY;
    this.controlPointX = controlPointX;
    this.controlPointY = controlPointY;
  }
}
