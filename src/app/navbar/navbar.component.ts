import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

declare var $: any;

@Component({
  selector: 'hc-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('center') center: ElementRef;
  @ViewChild('tabs') tabs: ElementRef;

  public tabScrollPosition: number = 0;
  public leftScrollerVisible: boolean = false;
  public rightScrollerVisible: boolean = false;

  private _clickScrollDelta: number = 100;
  private _panDelta: number = 0;
  private _leftInterval: number;
  private _rightInterval: number;

  public ngAfterViewInit(): void {
    setTimeout(() => { this.refreshScroller(); }, 0);
  }

  public startScrollingLeft(event: any): void {
    this.scrollTabs(this._clickScrollDelta);
    this._leftInterval = setInterval(() => { this.scrollTabs(this._clickScrollDelta); }, 100);
  }

  public stopScrollingLeft(event: any): void {
    clearInterval(this._leftInterval);
  }

  public startScrollingRight(event: any): void {
    this.scrollTabs(-this._clickScrollDelta);
    this._rightInterval = setInterval(() => { this.scrollTabs(-this._clickScrollDelta); }, 100);
  }

  public stopScrollingRight(event: any): void {
    clearInterval(this._rightInterval);
  }

  public onMouseWheel(event: any): void {
    // Firefox has a special implementation via event.detail
    let scrollDelta: number = (-event.wheelDelta || (event.detail * 40));
    this.scrollTabs(scrollDelta);
  }

  public panTabsStart(event: any): void {
    this.scrollTabs(event.deltaX);
    this._panDelta = event.deltaX;
  }

  public panTabs(event: any): void {
    this.scrollTabs(event.deltaX - this._panDelta);
    this._panDelta = event.deltaX;
  }

  private scrollTabs(scrollDelta: number): void {
    if ((scrollDelta < 0 && !this.rightScrollerVisible)
      || scrollDelta >= 0 && !this.leftScrollerVisible) {
      return;
    }

    let divWidth: number = $(this.center.nativeElement).width();
    let ulWidth: number = this.tabs.nativeElement.scrollWidth;
    let ulDelta: number = Math.max(0, ulWidth - divWidth);
    this.tabScrollPosition = Math.min(Math.max(-ulDelta, this.tabScrollPosition + scrollDelta), 0);
    this.refreshScroller();
  }

  @HostListener('window:resize')
  private refreshScroller(): void {
    let divWidth: number = $(this.center.nativeElement).width();
    let ulWidth: number = this.tabs.nativeElement.scrollWidth;
    let ulDelta: number = Math.max(0, ulWidth - divWidth);

    this.tabScrollPosition = Math.min(Math.max(-ulDelta, this.tabScrollPosition), 0);

    if (ulDelta) {
      if (this.tabScrollPosition === 0) {
        this.leftScrollerVisible = false;
      } else {
        this.leftScrollerVisible = true;
      }

      if (this.tabScrollPosition <= -ulDelta) {
        this.rightScrollerVisible = false;
      } else {
        this.rightScrollerVisible = true;
      }
    } else {
      this.leftScrollerVisible = false;
      this.rightScrollerVisible = false;
    }
  }
}
