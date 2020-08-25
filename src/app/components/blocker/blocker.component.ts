import { Component } from '@angular/core';

@Component({
  selector: 'hc-blocker',
  templateUrl: './blocker.component.html',
  styleUrls: ['./blocker.component.scss']
})
export class BlockerComponent {

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }
}
