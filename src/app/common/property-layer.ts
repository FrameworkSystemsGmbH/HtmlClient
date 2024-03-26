
/**
 * Bei Controls können die Properties (bsp. visible) auf unterschiedlichen Ebenen gesetzt werden.
 * Erst im ControlStyle, dann am Control selbst, in der Action, oder letztendlich im CSC.
 * Es werden keine Properties überschrieben, wie im JavaClient
 */
export enum PropertyLayer {
  ControlStyle = 0,
  Control = 1,
  Action = 2,
  CSC = 3
}
