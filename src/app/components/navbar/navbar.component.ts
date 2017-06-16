import { animate, transition, trigger, state, style } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { FormWrapper } from '../../wrappers';
import { FormsService } from '../../services/forms.service';
import { RoutingService } from '../../services/routing.service';

declare var $;

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
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('center') center: ElementRef;
  @ViewChild('tabs') tabs: ElementRef;

  public forms: Array<FormWrapper>;
  public selectedForm: FormWrapper;
  public tabScrollPosition: number = 0;
  public leftScrollerVisible: boolean = false;
  public rightScrollerVisible: boolean = false;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  private clickScrollDelta: number = 100;
  private panStartX: number;
  private leftInterval: number;
  private rightInterval: number;

  private formsSub: ISubscription;
  private selectedFormSub: ISubscription;

  constructor(
    private routingService: RoutingService,
    private formsService: FormsService) { }

  public ngOnInit(): void {
    this.formsSub = this.formsService.getForms().subscribe(forms => { this.forms = forms; });
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.selectedForm = form });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => { this.refreshScroller(); }, 0);
  }

  public ngOnDestroy(): void {
    this.formsSub.unsubscribe();
    this.selectedFormSub.unsubscribe();
  }

  public mediaQueryChanged(mq: MediaQueryList) {
    this.sidebarEnabled = !mq.matches;

    if (!this.sidebarEnabled && this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public startScrollingLeft(event: any): void {
    this.scrollTabs(this.clickScrollDelta);
    this.leftInterval = setInterval(() => { this.scrollTabs(this.clickScrollDelta); }, 100);
  }

  public stopScrollingLeft(event: any): void {
    clearInterval(this.leftInterval);
  }

  public startScrollingRight(event: any): void {
    this.scrollTabs(-this.clickScrollDelta);
    this.rightInterval = setInterval(() => { this.scrollTabs(-this.clickScrollDelta); }, 100);
  }

  public stopScrollingRight(event: any): void {
    clearInterval(this.rightInterval);
  }

  public onMouseWheel(event: any): void {
    // Firefox has a special implementation via event.detail
    let deltaX: number = -(event.wheelDelta || (event.detail * 40));
    this.scrollTabs(deltaX);
  }

  public panTabsStart(event: any) {
    this.panStartX = this.tabScrollPosition;
    this.scrollTabs(this.panStartX + event.deltaX, true);
  }

  public panTabsStep(event: any): void {
    this.scrollTabs(this.panStartX + event.deltaX, true);
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

  public switchBroker(): void {
    this.routingService.showLogin();
  }

  public selectForm(form: FormWrapper): void {
    this.formsService.selectForm(form);
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
