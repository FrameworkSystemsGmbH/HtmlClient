import { animate, transition, trigger, state, style } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

import { WindowRefService } from '../services/windowref.service';

@Component({
  selector: 'hc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('sidebar', [
      transition('void => *', [
        style({
          transform: 'translateX(-300px)'
        }),
        animate(200, style({
          transform: 'translateX(0px)'
        }))]),
      transition('* => void', [
        style({
          transform: 'translateX(0px)'
        }),
        animate(200, style({
          transform: 'translateX(-300px)'
        }))])
    ])
  ]
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('center') center: ElementRef;
  @ViewChild('tabs') tabs: ElementRef;

  public tabScrollPosition: number = 0;
  public leftScrollerVisible: boolean = false;
  public rightScrollerVisible: boolean = false;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  private _clickScrollDelta: number = 100;
  private _panStartX: number;
  private _leftInterval: number;
  private _rightInterval: number;

  public forms: Array<string> = ['Auftrag', 'Bestellung', 'Projekt', 'Leistungserfassung', 'Call'];

  public ngAfterViewInit(): void {
    setTimeout(() => { this.refreshScroller(); }, 0);
  }

  public mediaQueryChanged(mq: MediaQueryList) {
    this.sidebarEnabled = !mq.matches;

    if (!this.sidebarEnabled && this.sidebarVisible) {
      this.toggleSidebar();
    }
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
    let deltaX: number = -(event.wheelDelta || (event.detail * 40));
    this.scrollTabs(deltaX);
  }

  public panTabsStart(event: any) {
    this._panStartX = this.tabScrollPosition;
    this.scrollTabs(this._panStartX + event.deltaX, true);
  }

  public panTabsStep(event: any): void {
    this.scrollTabs(this._panStartX + event.deltaX, true);
  }

  private scrollTabs(deltaX: number, absolute: boolean = false): void {
    let divWidth: number = $(this.center.nativeElement).width();
    let ulWidth: number = this.tabs.nativeElement.scrollWidth;
    let maxScroll: number = Math.max(0, ulWidth - divWidth);
    this.tabScrollPosition = Math.min(Math.max(-maxScroll, (absolute ? 0 : this.tabScrollPosition) + deltaX), 0);
    this.refreshScroller();
  }

  public toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('window:resize')
  private refreshScroller(): void {
    let divWidth: number = $(this.center.nativeElement).width();
    let ulWidth: number = this.tabs.nativeElement.scrollWidth;
    let maxScroll: number = Math.max(0, ulWidth - divWidth);

    this.tabScrollPosition = Math.min(Math.max(-maxScroll, this.tabScrollPosition), 0);

    if (maxScroll) {
      if (this.tabScrollPosition === 0) {
        this.leftScrollerVisible = false;
      } else {
        this.leftScrollerVisible = true;
      }

      if (this.tabScrollPosition <= -maxScroll) {
        this.rightScrollerVisible = false;
      } else {
        this.rightScrollerVisible = true;
      }
    } else {
      this.leftScrollerVisible = false;
      this.rightScrollerVisible = false;
    }
  }

  @HostListener('body:swipeleft')
  private swipeLeft(): void {
    if (this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  @HostListener('body:swiperight', ['$event'])
  private swipeRight(event: any): void {
    let startX: number = event.center.x - event.deltaX;
    if (startX < 20 && this.sidebarEnabled && !this.sidebarVisible) {
      this.toggleSidebar();
    }
  }
}
