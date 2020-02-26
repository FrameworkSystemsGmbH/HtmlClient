import { animate, transition, trigger, style } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewChecked, HostListener, OnInit, OnDestroy, NgZone, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromAppReducers from 'app/app.reducers';

import { FormWrapper } from 'app/wrappers/form-wrapper';
import { EventsService } from 'app/services/events.service';
import { FormsService } from 'app/services/forms.service';
import { LoaderService } from 'app/services/loader.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { TitleService } from 'app/services/title.service';
import { DomUtil } from 'app/util/dom-util';
import { StyleUtil } from 'app/util/style-util';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

@Component({
  selector: 'hc-base-header',
  templateUrl: './base-header.component.html',
  styleUrls: ['./base-header.component.scss'],
  animations: [
    trigger('sidebar', [
      transition('void => *', [
        style({
          transform: 'translateX(-30rem)'
        }),
        animate(200, style({
          transform: 'translateX(0)'
        }))]),
      transition('* => void', [
        style({
          transform: 'translateX(0)'
        }),
        animate(200, style({
          transform: 'translateX(-30rem)'
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
export class BaseHeaderComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scroller', { static: true })
  public scroller: OverlayScrollbarsComponent;

  @ViewChild('arrowLeft', { static: true })
  public arrowLeft: ElementRef;

  @ViewChild('arrowRight', { static: true })
  public arrowRight: ElementRef;

  @ViewChild('tabs', { static: true })
  public tabs: ElementRef;

  public forms: Array<FormWrapper>;
  public selectedForm: FormWrapper;
  public directMode: boolean;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;
  public isLoading: boolean = false;

  private storeSub: Subscription;
  private formsSub: Subscription;
  private selectedFormSub: Subscription;
  private loadingChangedSub: Subscription;

  public headerSideStyle: any;
  public headerSideOverlayStyle: any;

  private visibleClass: string = 'arrowVisible';

  private scrollLeftInterval: any;
  private scrollRightInterval: any;

  private scrollDelta: number = 100;
  private scrollAnimationTime: number = 250;
  private scrollAutoHideDelay: number = 500;

  public scrollerOptions: any = {
    className: 'os-thin',
    paddingAbsolute: true,
    overflowBehavior: {
      x: 'scroll',
      y: 'hidden'
    },
    scrollbars: {
      autoHide: 'scroll',
      autoHideDelay: this.scrollAutoHideDelay
    },
    callbacks: {
      onScroll: this.refreshScroller.bind(this),
      onOverflowChanged: this.refreshScroller.bind(this),
      onOverflowAmountChanged: this.refreshScroller.bind(this)
    }
  };

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
    private eventsService: EventsService,
    private loaderService: LoaderService,
    private formsService: FormsService,
    private platformService: PlatformService,
    private titleService: TitleService,
    private store: Store<fromAppReducers.IAppState>) { }

  public ngOnInit(): void {
    this.storeSub = this.store.select(state => state.broker.activeBrokerDirect).subscribe(direct => this.directMode = direct);
    this.formsSub = this.formsService.getForms().subscribe(forms => this.forms = forms);
    this.selectedFormSub = this.formsService.getSelectedForm().subscribe(this.onSelectedFormChanged.bind(this));
    this.loadingChangedSub = this.loaderService.onLoadingChangedDelayed.subscribe(loading => this.isLoading = loading);

    this.headerSideStyle = this.createheaderSideStyle();
    this.headerSideOverlayStyle = this.createheaderSideOverlayStyle();

    this.scrollerOptions = this.createScrollOptions();
  }

  public ngAfterViewChecked(): void {
    this.refreshScroller();
  }

  public ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.formsSub.unsubscribe();
    this.selectedFormSub.unsubscribe();
    this.loadingChangedSub.unsubscribe();
  }

  public mediaQueryChanged(matches: boolean) {
    this.sidebarEnabled = !matches;

    if (!this.sidebarEnabled && this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  private onSelectedFormChanged(form: FormWrapper): void {
    const changed: boolean = this.selectedForm !== form;
    this.selectedForm = form;

    if (changed) {
      this.scrollIntoView();
    }
  }

  private createScrollOptions(): any {
    if (this.platformService.isMobile()) {
      return {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: this.scrollAutoHideDelay
        }
      };
    } else {
      return {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'move',
          autoHideDelay: this.scrollAutoHideDelay
        }
      };
    }
  }

  private createheaderSideStyle(): any {
    return {
      'top.rem': this.platformService.isIos() ? (StyleUtil.headerHeight + StyleUtil.iosMenubarHeight) : StyleUtil.headerHeight
    };
  }

  private createheaderSideOverlayStyle(): any {
    return {
      'top.rem': this.platformService.isIos() ? (StyleUtil.headerHeight + StyleUtil.iosMenubarHeight) : StyleUtil.headerHeight
    };
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

  public toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public switchBroker(): void {
    this.eventsService.fireApplicationQuitRequest();
  }

  public selectForm(event: any, form: FormWrapper): void {
    const target: HTMLElement = event.target;

    if (target && DomUtil.isInClass(target, 'hc-header-close-icon-event-span')) {
      return;
    }

    this.formsService.selectForm(form);

    if (this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public closeForm(form: FormWrapper): void {
    this.formsService.closeFormByButton(form);
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.scroller != null && this.scroller.osInstance() != null && this.tabs != null) {
        const selectedTab: HTMLLIElement = this.tabs.nativeElement.querySelector('div.active');
        if (selectedTab) {
          this.scroller.osInstance().scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, this.scrollAnimationTime);
        }
      }
    });
  }

  public startScrollingLeft(event: any): void {
    if (event.button === 0) {
      const value: string = `-= ${this.scrollDelta}px`;
      this.scrollHorizontal(value);
      this.scrollLeftInterval = setInterval(() => { this.scrollHorizontal(value); }, this.scrollAnimationTime);
    }
  }

  public stopScrollingLeft(): void {
    clearInterval(this.scrollLeftInterval);
  }

  public startScrollingRight(event: any): void {
    if (event.button === 0) {
      const value: string = `+= ${this.scrollDelta}px`;
      this.scrollHorizontal(value);
      this.scrollRightInterval = setInterval(() => { this.scrollHorizontal(value); }, this.scrollAnimationTime);
    }
  }

  public stopScrollingRight(): void {
    clearInterval(this.scrollRightInterval);
  }

  protected scrollHorizontal(value: string): void {
    this.scroller.osInstance().scroll({ x: value }, this.scrollAnimationTime);
  }

  protected scrollVertical(value: string): void {
    this.scroller.osInstance().scroll({ y: value }, this.scrollAnimationTime);
  }

  @HostListener('window:resize')
  public refreshScroller(): void {
    this.zone.runOutsideAngular(() => {
      if (this.scroller != null && this.scroller.osInstance() != null) {
        const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;

        if (overflow > 0) {
          const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;

          if (scrollPos === 0) {
            this.stopScrollingLeft();
            this.renderer.removeClass(this.arrowLeft.nativeElement, this.visibleClass);
            this.renderer.addClass(this.arrowRight.nativeElement, this.visibleClass);
          } else if (scrollPos >= overflow) {
            this.stopScrollingRight();
            this.renderer.addClass(this.arrowLeft.nativeElement, this.visibleClass);
            this.renderer.removeClass(this.arrowRight.nativeElement, this.visibleClass);
          } else {
            this.renderer.addClass(this.arrowLeft.nativeElement, this.visibleClass);
            this.renderer.addClass(this.arrowRight.nativeElement, this.visibleClass);
          }
        } else {
          this.stopScrollingLeft();
          this.stopScrollingRight();
          this.renderer.removeClass(this.arrowLeft.nativeElement, this.visibleClass);
          this.renderer.removeClass(this.arrowRight.nativeElement, this.visibleClass);
        }
      }
    });
  }
}
