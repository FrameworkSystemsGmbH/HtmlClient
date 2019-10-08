export class ClientPhotoTakenEventArgs {

  protected hasError: boolean;
  protected errorMessage: string;
  protected imageData: string;

  constructor(hasError: boolean, errorMessage: string, imageData: string) {
    this.hasError = hasError;
    this.errorMessage = errorMessage;
    this.imageData = imageData;
  }
}
