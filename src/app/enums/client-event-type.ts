export enum ClientEventType {
  None                     = 0,
  OnEnter                  = 1 << 0,
  OnLeave                  = 1 << 1,
  OnClick                  = 1 << 2,
  OnSelectionChanged       = 1 << 3,
  OnValidated              = 1 << 4,
  OnClose                  = 1 << 5,
  OnDispose                = 1 << 6,
  OnApplicationQuitRequest = 1 << 7,
  OnApplicationQuit        = 1 << 8,
  OnItemSelectionChanged   = 1 << 9,
  OnItemActivated          = 1 << 10,
  MsgBox                   = 1 << 11,
  BarcodeScanned           = 1 << 12,
  PhotoTaken               = 1 << 13,
  GotGeoLocation           = 1 << 14
}
