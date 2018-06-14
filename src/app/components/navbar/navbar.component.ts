import { animate, transition, trigger, style } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewChecked, HostListener, OnInit, OnDestroy, NgZone, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromAppReducers from 'app/app.reducers';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { TitleService } from 'app/services/title.service';
import { FormsService } from 'app/services/forms.service';
import { RoutingService } from 'app/services/routing.service';
import { DomUtil } from 'app/util/dom-util';
import { StyleUtil } from 'app/util/style-util';

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
export class NavbarComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('center')
  public center: ElementRef;

  @ViewChild('tabs')
  public tabs: ElementRef;

  @ViewChild('arrowLeft')
  public arrowLeft: ElementRef;

  @ViewChild('arrowRight')
  public arrowRight: ElementRef;

  public forms: Array<FormWrapper>;
  public selectedForm: FormWrapper;
  public directMode: boolean;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  private tabScrollPosition: number = 0;
  private clickScrollDelta: number = 100;
  private panStartX: number;
  private leftInterval: any;
  private rightInterval: any;

  private storeSub: Subscription;
  private formsSub: Subscription;
  private selectedFormSub: Subscription;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
    private titleService: TitleService,
    private routingService: RoutingService,
    private formsService: FormsService,
    private store: Store<fromAppReducers.IAppState>) { }

  public ngOnInit(): void {
    this.storeSub = this.store.select(state => state.broker.activeBrokerDirect).subscribe(direct => this.directMode = direct);
    this.formsSub = this.formsService.getForms().subscribe(forms => { this.forms = forms; });
    this.selectedFormSub = this.formsService.formSelected.subscribe(form => { this.selectedForm = form; });
  }

  public ngAfterViewChecked(): void {
    this.refreshScroller();
  }

  public ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.formsSub.unsubscribe();
    this.selectedFormSub.unsubscribe();
  }

  public mediaQueryChanged(mq: MediaQueryList) {
    this.sidebarEnabled = !mq.matches;

    if (!this.sidebarEnabled && this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public getTitle(): string {
    if (!this.sidebarEnabled || this.selectedForm == null) {
      return this.titleService.getTitle();
    } else {
      return this.selectedForm.getTitle();
    }
  }

  public getSidebarTitle(): string {
    return this.titleService.getTitle();
  }

  public startScrollingLeft(event: any): void {
    if (event.button === 0) {
      this.scrollTabs(this.clickScrollDelta);
      this.leftInterval = setInterval(() => { this.scrollTabs(this.clickScrollDelta); }, 100);
    }
  }

  public stopScrollingLeft(event: any): void {
    clearInterval(this.leftInterval);
  }

  public startScrollingRight(event: any): void {
    if (event.button === 0) {
      this.scrollTabs(-this.clickScrollDelta);
      this.rightInterval = setInterval(() => { this.scrollTabs(-this.clickScrollDelta); }, 100);
    }
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
    const divWidth: number = this.center.nativeElement.clientWidth;
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
    this.zone.runOutsideAngular(() => {
      const divWidth: number = this.center.nativeElement.clientWidth;
      const ulWidth: number = this.tabs.nativeElement.scrollWidth;
      const maxScroll: number = Math.max(0, ulWidth - divWidth);

      this.tabScrollPosition = Math.min(Math.max(-maxScroll, this.tabScrollPosition), 0);
      this.renderer.setStyle(this.tabs.nativeElement, 'margin-left', StyleUtil.getValue('px', this.tabScrollPosition));

      if (maxScroll) {
        this.renderer.setStyle(this.arrowLeft.nativeElement, 'visibility', this.tabScrollPosition !== 0 ? 'visible' : 'hidden');
        this.renderer.setStyle(this.arrowRight.nativeElement, 'visibility', !(this.tabScrollPosition <= -maxScroll) ? 'visible' : 'hidden');
      } else {
        this.renderer.setStyle(this.arrowLeft.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(this.arrowRight.nativeElement, 'visibility', 'hidden');
      }
    });
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
