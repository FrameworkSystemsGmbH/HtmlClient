import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { EventsService } from '@app/services/events.service';
import { FormsService } from '@app/services/forms.service';
import { PlatformService } from '@app/services/platform.service';
import { TitleService } from '@app/services/title.service';
import { selectBrokerDirect } from '@app/store/broker/broker.selectors';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { faAngleLeft, faAngleRight, faBars, faSignOutAlt, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';
import { Subscription } from 'rxjs';

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

  public iconBars: IconDefinition = faBars;
  public iconTimes: IconDefinition = faTimes;
  public iconAngleLeft: IconDefinition = faAngleLeft;
  public iconAngleRight: IconDefinition = faAngleRight;
  public iconSignOut: IconDefinition = faSignOutAlt;

  public forms: Array<FormWrapper>;
  public selectedForm: FormWrapper;
  public directMode: boolean;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  public headerSideStyle: any;
  public headerSideOverlayStyle: any;

  public scrollerOptions: any;

  private _storeSub: Subscription;
  private _formsSub: Subscription;
  private _selectedFormSub: Subscription;

  private _scrollLeftInterval: any;
  private _scrollRightInterval: any;

  private readonly _visibleClass: string = 'arrowVisible';

  private readonly _scrollDelta: number = 100;
  private readonly _scrollAnimationTime: number = 250;
  private readonly _scrollAutoHideDelay: number = 500;

  public constructor(
    private readonly _zone: NgZone,
    private readonly _renderer: Renderer2,
    private readonly _eventsService: EventsService,
    private readonly _formsService: FormsService,
    private readonly _platformService: PlatformService,
    private readonly _titleService: TitleService,
    private readonly _store: Store
  ) {
    this.scrollerOptions = {
      className: 'os-thin',
      paddingAbsolute: true,
      overflowBehavior: {
        x: 'scroll',
        y: 'hidden'
      },
      scrollbars: {
        autoHide: 'scroll',
        autoHideDelay: this._scrollAutoHideDelay
      },
      callbacks: {
        onScroll: this.refreshScroller.bind(this),
        onOverflowChanged: this.refreshScroller.bind(this),
        onOverflowAmountChanged: this.refreshScroller.bind(this)
      }
    };
  }

  @HostListener('window:resize')
  public refreshScroller(): void {
    this._zone.runOutsideAngular(() => {
      if (this.scroller != null && this.scroller.osInstance() != null) {
        const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;

        if (overflow > 0) {
          const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;

          if (scrollPos === 0) {
            this.stopScrollingLeft();
            this._renderer.removeClass(this.arrowLeft.nativeElement, this._visibleClass);
            this._renderer.addClass(this.arrowRight.nativeElement, this._visibleClass);
          } else if (scrollPos >= overflow) {
            this.stopScrollingRight();
            this._renderer.addClass(this.arrowLeft.nativeElement, this._visibleClass);
            this._renderer.removeClass(this.arrowRight.nativeElement, this._visibleClass);
          } else {
            this._renderer.addClass(this.arrowLeft.nativeElement, this._visibleClass);
            this._renderer.addClass(this.arrowRight.nativeElement, this._visibleClass);
          }
        } else {
          this.stopScrollingLeft();
          this.stopScrollingRight();
          this._renderer.removeClass(this.arrowLeft.nativeElement, this._visibleClass);
          this._renderer.removeClass(this.arrowRight.nativeElement, this._visibleClass);
        }
      }
    });
  }

  public ngOnInit(): void {
    this._storeSub = this._store.select(selectBrokerDirect).subscribe(direct => {
      this.directMode = direct;
    });

    this._formsSub = this._formsService.getForms().subscribe(forms => {
      this.forms = forms;
    });

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(this.onSelectedFormChanged.bind(this));

    this.headerSideStyle = this.createheaderSideStyle();
    this.headerSideOverlayStyle = this.createheaderSideOverlayStyle();

    this.scrollerOptions = this.createScrollOptions();
  }

  public ngAfterViewChecked(): void {
    this.refreshScroller();
  }

  public ngOnDestroy(): void {
    this._storeSub.unsubscribe();
    this._formsSub.unsubscribe();
    this._selectedFormSub.unsubscribe();
  }

  public mediaQueryChanged(matches: boolean): void {
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
    if (this._platformService.isNative()) {
      return {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: this._scrollAutoHideDelay
        }
      };
    } else {
      return {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'move',
          autoHideDelay: this._scrollAutoHideDelay
        }
      };
    }
  }

  private createheaderSideStyle(): any {
    return {
      'top.rem': this._platformService.isIos() ? StyleUtil.pixToRem(StyleUtil.headerHeight + StyleUtil.iosMenubarHeight) : StyleUtil.pixToRem(StyleUtil.headerHeight)
    };
  }

  private createheaderSideOverlayStyle(): any {
    return {
      'top.rem': this._platformService.isIos() ? StyleUtil.pixToRem(StyleUtil.headerHeight + StyleUtil.iosMenubarHeight) : StyleUtil.pixToRem(StyleUtil.headerHeight)
    };
  }

  public getBadgeImageSrc(): SafeUrl {
    if (!this.sidebarEnabled || this.selectedForm == null) {
      return null;
    } else {
      return this.selectedForm.getBadgeImageSrc();
    }
  }

  public getTitle(): string {
    if (!this.sidebarEnabled || this.selectedForm == null) {
      return this._titleService.getTitle();
    } else {
      return this.selectedForm.getTitle();
    }
  }

  public getSidebarTitle(): string {
    return this._titleService.getTitle();
  }

  public toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public switchBroker(): void {
    this._eventsService.fireApplicationQuitRequest();
  }

  public selectForm(event: any, form: FormWrapper): void {
    const target: HTMLElement = event.target;

    if (target && DomUtil.isInClass(target, 'hc-header-close-icon-event-span')) {
      return;
    }

    this._formsService.selectForm(form);

    if (this.sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public closeForm(form: FormWrapper): void {
    this._formsService.closeFormByButton(form);
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.scroller != null && this.scroller.osInstance() != null && this.tabs != null) {
        const selectedTab: HTMLLIElement = this.tabs.nativeElement.querySelector('div.active');
        if (selectedTab) {
          this.scroller.osInstance().scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, this._scrollAnimationTime);
        }
      }
    });
  }

  public startScrollingLeft(event: any): void {
    if (event.button === 0) {
      const value: string = `-= ${this._scrollDelta}px`;
      this.scrollHorizontal(value);
      this._scrollLeftInterval = setInterval(() => {
        this.scrollHorizontal(value);
      }, this._scrollAnimationTime);
    }
  }

  public stopScrollingLeft(): void {
    clearInterval(this._scrollLeftInterval);
  }

  public startScrollingRight(event: any): void {
    if (event.button === 0) {
      const value: string = `+= ${this._scrollDelta}px`;
      this.scrollHorizontal(value);
      this._scrollRightInterval = setInterval(() => {
        this.scrollHorizontal(value);
      }, this._scrollAnimationTime);
    }
  }

  public stopScrollingRight(): void {
    clearInterval(this._scrollRightInterval);
  }

  protected scrollHorizontal(value: string): void {
    this.scroller.osInstance().scroll({ x: value }, this._scrollAnimationTime);
  }

  protected scrollVertical(value: string): void {
    this.scroller.osInstance().scroll({ y: value }, this._scrollAnimationTime);
  }
}
