export enum PictureScaleMode {
  // Beide Achsen skalieren (hoch oder runter)
  Stretch = 0,

  // Zentrieren - Originalgröße
  Center = 1,

  // Proportional skalieren (hoch oder runter)
  // Links oben
  Zoom = 2,
  // Proportional skalieren (hoch oder runter)
  // zentrieren

  ZoomCenter = 3,

  // Proportional skalieren (runter)
  // Links, oben
  ScaleDown = 4,

  // Proportional skalieren (runter)
  // zentrieren
  ScaleDownCenter = 5,

  // Bild links oben platzieren
  Normal = 6,

  // Base-Property ziehen
  Inherit = -1
}
