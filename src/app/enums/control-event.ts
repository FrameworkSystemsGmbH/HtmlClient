export enum ControlEvent {
  None                = 0,
  OnEnter             = 1 << 0,
  OnLeave             = 1 << 1,
  OnClick             = 1 << 4,
  OnSelectionChanged  = 1 << 5,
  OnValidated         = 1 << 6,
  OnClose             = 1 << 7,
  OnDispose           = 1 << 8
}
