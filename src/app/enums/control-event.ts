export enum ControlEvent {
  None        = 0,
  OnEnter     = 1 << 0,
  OnLeave     = 1 << 1,
  OnClick     = 1 << 4,
  OnValidated = 1 << 5,
  OnClose     = 1 << 6,
  OnDispose   = 1 << 7
}
