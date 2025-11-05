import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'hc-blocker',
    templateUrl: './blocker.component.html',
    styleUrls: ['./blocker.component.scss'],
    animations: [
        trigger('indicatorState', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 }))
            ])
        ])
    ]
})
export class BlockerComponent implements OnInit, OnDestroy {

  private static readonly SHOW_DELAY: number = 0;

  public showIndicator: boolean = false;

  private _indicatorSub: Subscription | null = null;

  public ngOnInit(): void {
    this._indicatorSub = EMPTY.pipe(delay(BlockerComponent.SHOW_DELAY)).subscribe({
      complete: () => {
        this.showIndicator = true;
      }
    });
  }

  public ngOnDestroy(): void {
    this._indicatorSub?.unsubscribe();
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }
}
