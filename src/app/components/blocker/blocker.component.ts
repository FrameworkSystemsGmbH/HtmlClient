import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'hc-blocker',
  templateUrl: './blocker.component.html',
  styleUrls: ['./blocker.component.scss'],
  imports: [
    CommonModule
  ],
  animations: [
    trigger('indicatorState', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BlockerComponent implements OnInit {

  private static readonly SHOW_DELAY: number = 0;

  public showIndicator: boolean = false;

  public ngOnInit(): void {
    EMPTY.pipe(delay(BlockerComponent.SHOW_DELAY)).subscribe(
      {
        complete: () => {
          this.showIndicator = true;
        }
      });
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }
}
