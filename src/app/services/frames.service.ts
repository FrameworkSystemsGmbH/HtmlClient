import { Injectable } from '@angular/core';
import { FrameComponent } from '@app/components/frame/frame.component';

@Injectable()
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
