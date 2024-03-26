import { Injectable } from '@angular/core';
import { FrameComponent } from '@app/components/frame/frame.component';

/** In der Theorie können mehrere Frames unterstützt werden.
 * Es gibt aber derzeit nur eine FrameComponent, deshalb gibt es nur einen Frame.
 * Es könnten zwei Frames angezeigt werden, das Layout würde funktionieren.*/
@Injectable({ providedIn: 'root' })
export class FramesService {

  private readonly _frames: Array<FrameComponent> = new Array<FrameComponent>();

  public registerFrame(frame: FrameComponent): void {
    if (this._frames.filter(frameComp => frameComp === frame).length === 0) {
      this._frames.push(frame);
    }
  }

  public layout(): void {
    this._frames.forEach(frame => frame.layout());
  }
}
