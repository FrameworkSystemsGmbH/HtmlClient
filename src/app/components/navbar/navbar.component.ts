import { animate, transition, trigger, style } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { FormsService } from 'app/services/forms.service';
import { RoutingService } from 'app/services/routing.service';
import { DomUtil } from 'app/util/dom-util';

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
    ]),
    trigger('overlay', [
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(200, style({
          opacity: 0.75
        }))]),
      transition('* => void', [
        style({
          opacity: 0.75
        }),
        animate(200, style({
          opacity: 0
        }))])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('center')
  public center: ElementRef;

  @ViewChild('tabs')
  public tabs: ElementRef;

  public forms: Array<FormWrapper>;
  public selectedForm: FormWrapper;
  public tabScrollPosition: number = 0;
  public leftScrollerVisible: boolean = false;
  public rightScrollerVisible: boolean = false;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  private clickScrollDelta: number = 100;
  private panStartX: number;
  private leftInterval: any;
  private rightInterval: any;

  private formsSub: ISubscription;
  private selectedFormSub: ISubscription;

  constructor(
    private routingService: RoutingService,
    private formsService: FormsService) { }

  public ngOnInit(): void {
    this.formsSub = this.formsService.getForms().subscribe(forms => { this.forms = forms; });
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.selectedForm = form; });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.refreshScroller());
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
    const deltaX: number = -(event.wheelDelta || (event.detail * 40));
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
    const divWidth: number = this.center.nativeElement.width;
    const ulWidth: number = this.tabs.nativeElement.scrollWidth;
    const maxScroll: number = Math.max(0, ulWidth - divWidth);
    this.tabScrollPosition = Math.min(Math.max(-maxScroll, (absolute ? 0 : this.tabScrollPosition) + deltaX), 0);
    this.refreshScroller();
  }

  public toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public switchBroker(): void {
    this.routingService.showLogin();
  }

  public selectForm(event: any, form: FormWrapper): void {
    const target: HTMLElement = event.target;

    if (target && DomUtil.isInClass(target, 'hc-navbar-close-icon-event-span')) {
      return;
    }

    this.formsService.selectForm(form);

    if (this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public closeForm(event: any, form: FormWrapper): void {
    this.formsService.closeForm(form);
  }

  @HostListener('window:resize')
  public refreshScroller(): void {
    const divWidth: number = this.center.nativeElement.width;
    const ulWidth: number = this.tabs.nativeElement.scrollWidth;
    const maxScroll: number = Math.max(0, ulWidth - divWidth);

    this.tabScrollPosition = Math.min(Math.max(-maxScroll, this.tabScrollPosition), 0);

    if (maxScroll) {
      this.leftScrollerVisible = this.tabScrollPosition === 0;
      this.rightScrollerVisible = !(this.tabScrollPosition <= -maxScroll);
    } else {
      this.leftScrollerVisible = false;
      this.rightScrollerVisible = false;
    }
  }

  @HostListener('body:swipeleft')
  public swipeLeft(): void {
    if (this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  @HostListener('body:swiperight', ['$event'])
  public swipeRight(event: any): void {
    const startX: number = event.center.x - event.deltaX;
    if (startX < 20 && this.sidebarEnabled && !this.sidebarVisible) {
      this.toggleSidebar();
    }
  }
}
