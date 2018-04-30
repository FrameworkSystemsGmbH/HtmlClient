import { FrameComponent } from 'app/components/frame/frame.component';

export class FramesService {

  private frames: Array<FrameComponent> = new Array<FrameComponent>();

  public registerFrame(frame: FrameComponent): void {
    if (!this.frames.includes(frame)) {
      this.frames.push(frame);
    }
  }

  public layout(): void {
    this.frames.forEach(frame => frame.layout());
  }
}
