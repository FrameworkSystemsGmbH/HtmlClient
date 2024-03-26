export enum BackButtonPriority {
  // Error-Dialog
  Overlay = 0,
  // In einer Form, welche Modal ist (nicht modaler Dialog), haben teilweise kein Close-Button.
  ModalDialog = 1,
  //Angemeldet am Broker und ich sehe eine App
  ActiveBroker = 2
}
