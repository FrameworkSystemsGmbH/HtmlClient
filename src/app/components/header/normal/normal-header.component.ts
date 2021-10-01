import { AfterViewChecked, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { EventsService } from '@app/services/events.service';
import { FormsService } from '@app/services/forms.service';
import { PlatformService } from '@app/services/platform.service';
import { IAppState } from '@app/store/app.state';
import { selectBrokerDirect } from '@app/store/broker/broker.selectors';
import { toggleSidebar } from '@app/store/runtime/runtime.actions';
import { selectSidebarVisible, selectTitle } from '@app/store/runtime/runtime.selectors';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { faAngleLeft, faAngleRight, faBars, faSignOutAlt, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-normal-header',
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss']
})
export class NormalHeaderComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scroller', { static: false })
  public scroller: OverlayScrollbarsComponent | null = null;

  @ViewChild('arrowLeft', { static: false })
  public arrowLeft: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('arrowRight', { static: false })
  public arrowRight: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('tabs', { static: false })
  public tabs: ElementRef<HTMLDivElement> | null = null;

  public iconBars: IconDefinition = faBars;
  public iconTimes: IconDefinition = faTimes;
  public iconAngleLeft: IconDefinition = faAngleLeft;
  public iconAngleRight: IconDefinition = faAngleRight;
  public iconSignOut: IconDefinition = faSignOutAlt;

  public forms: Array<FormWrapper> | null = null;
  public selectedForm: FormWrapper | null = null;
  public appTitle: string | null = null;
  public disabledAttr: boolean | null = null;
  public showCompact: boolean = false;

  public headerSideStyle: any;
  public headerSideOverlayStyle: any;

  public scrollerOptions: any;

  private readonly _zone: NgZone;
  private readonly _renderer: Renderer2;
  private readonly _eventsService: EventsService;
  private readonly _formsService: FormsService;
  private readonly _platformService: PlatformService;
  private readonly _store: Store<IAppState>;

  private readonly _visibleClass: string = 'arrowVisible';

  private readonly _scrollDelta: number = 100;
  private readonly _scrollAnimationTime: number = 250;
  private readonly _scrollAutoHideDelay: number = 500;

  private _sidebarVisible: boolean = false;
  private _sidebarVisibleSub: Subscription | null = null;

  private _titleSub: Subscription | null = null;
  private _directSub: Subscription | null = null;
  private _formsSub: Subscription | null = null;
  private _selectedFormSub: Subscription | null = null;

  private _scrollLeftInterval: any;
  private _scrollRightInterval: any;

  public constructor(
    zone: NgZone,
    renderer: Renderer2,
    eventsService: EventsService,
    formsService: FormsService,
    platformService: PlatformService,
    store: Store<IAppState>
  ) {
    this._zone = zone;
    this._renderer = renderer;
    this._eventsService = eventsService;
    this._formsService = formsService;
    this._platformService = platformService;
    this._store = store;

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
      if (this.scroller == null) {
        return;
      }

      const osInstance: OverlayScrollbars | null = this.scroller.osInstance();

      if (osInstance == null) {
        return;
      }

      if (!this.arrowLeft || !this.arrowRight) {
        return;
      }

      const overflow: number = osInstance.getState().overflowAmount.x;

      if (overflow > 0) {
        const scrollPos: number = osInstance.getElements().viewport.scrollLeft;

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
    });
  }

  public ngOnInit(): void {
    this._titleSub = this._store.select(selectTitle).subscribe(title => {
      this.appTitle = title;
    });

    this._sidebarVisibleSub = this._store.select(selectSidebarVisible).subscribe(sidebarVisible => {
      this._sidebarVisible = sidebarVisible;
    });

    this._directSub = this._store.select(selectBrokerDirect).subscribe(direct => {
      this.disabledAttr = Boolean.nullIfFalse(direct);
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
    this._titleSub?.unsubscribe();
    this._sidebarVisibleSub?.unsubscribe();
    this._directSub?.unsubscribe();
    this._formsSub?.unsubscribe();
    this._selectedFormSub?.unsubscribe();
  }

  public mediaQueryChanged(matches: boolean): void {
    this.showCompact = !matches;

    if (!this.showCompact && this._sidebarVisible) {
      this.toggleSidebar();
    }
  }

  private onSelectedFormChanged(form: FormWrapper | null): void {
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

  public getFormTitle(): string | null {
    return this.selectedForm != null ? this.selectedForm.getTitle() : null;
  }

  public getFormBgColor(): string | null {
    return this.selectedForm != null ? this.selectedForm.getBackColor() : null;
  }

  public getBadgeImageSrc(): SafeUrl | null {
    return this.selectedForm != null ? this.selectedForm.getBadgeImageSrc() : null;
  }

  public toggleSidebar(): void {
    this._store.dispatch(toggleSidebar());
  }

  public switchBroker(): void {
    this._eventsService.fireApplicationQuitRequest();
  }

  public selectForm(event: any, form: FormWrapper): void {
    const target: HTMLElement | null = event.target;

    if (target && DomUtil.isInClass(target, 'header-form-close-btn')) {
      return;
    }

    this._formsService.selectForm(form);

    if (this._sidebarVisible) {
      this.toggleSidebar();
    }
  }

  public closeForm(form: FormWrapper): void {
    this._formsService.closeFormByButton(form);
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.scroller != null && this.tabs != null) {
        const osInstance: OverlayScrollbars | null = this.scroller.osInstance();
        const selectedTab: HTMLLIElement | null = this.tabs.nativeElement.querySelector('div.active');
        if (osInstance && selectedTab) {
          osInstance.scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, this._scrollAnimationTime);
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
    if (this.scroller != null) {
      const osInstance: OverlayScrollbars | null = this.scroller.osInstance();
      if (osInstance != null) {
        osInstance.scroll({ x: value }, this._scrollAnimationTime);
      }
    }
  }

  protected scrollVertical(value: string): void {
    if (this.scroller != null) {
      const osInstance: OverlayScrollbars | null = this.scroller.osInstance();
      if (osInstance != null) {
        osInstance.scroll({ y: value }, this._scrollAnimationTime);
      }
    }
  }
}
