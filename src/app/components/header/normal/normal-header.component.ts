import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MediaQueryDirective } from '@app/directives/media-query.directive';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faBars, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { Subscription } from 'rxjs';

@Component({
    selector: 'hc-normal-header',
    templateUrl: './normal-header.component.html',
    styleUrls: ['./normal-header.component.scss'],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MediaQueryDirective,
        OverlayscrollbarsModule
    ]
})
export class NormalHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('tabs', { static: false })
  public tabs: ElementRef<HTMLDivElement> | null = null;

  public iconBars: IconDefinition = faBars;
  public iconTimes: IconDefinition = faTimes;
  public iconSignOut: IconDefinition = faSignOutAlt;

  public forms: Array<FormWrapper> | null = null;
  public selectedForm: FormWrapper | null = null;
  public appTitle: string | null = null;
  public disabledAttr: boolean | null = null;
  public showCompact: boolean = false;

  public headerSideStyle: any;
  public headerSideOverlayStyle: any;

  public scrollerOptions: any;

  private readonly _eventsService: EventsService;
  private readonly _formsService: FormsService;
  private readonly _platformService: PlatformService;
  private readonly _store: Store<IAppState>;

  private readonly _scrollAutoHideDelay: number = 500;

  private _sidebarVisible: boolean = false;
  private _sidebarVisibleSub: Subscription | null = null;

  private _titleSub: Subscription | null = null;
  private _directSub: Subscription | null = null;
  private _formsSub: Subscription | null = null;
  private _selectedFormSub: Subscription | null = null;

  public constructor(
    eventsService: EventsService,
    formsService: FormsService,
    platformService: PlatformService,
    store: Store<IAppState>
  ) {
    this._eventsService = eventsService;
    this._formsService = formsService;
    this._platformService = platformService;
    this._store = store;

    this.scrollerOptions = {
      paddingAbsolute: true,
      overflowBehavior: {
        x: 'scroll',
        y: 'hidden'
      },
      scrollbars: {
        autoHide: 'scroll',
        autoHideDelay: this._scrollAutoHideDelay
      }
    };
  }

  public ngOnInit(): void {
    this._titleSub = this._store.select(selectTitle).subscribe({
      next: title => {
        this.appTitle = title;
      }
    });

    this._sidebarVisibleSub = this._store.select(selectSidebarVisible).subscribe({
      next: sidebarVisible => {
        this._sidebarVisible = sidebarVisible;
      }
    });

    this._directSub = this._store.select(selectBrokerDirect).subscribe({
      next: direct => {
        this.disabledAttr = Boolean.nullIfFalse(direct);
      }
    });

    this._formsSub = this._formsService.getForms().subscribe({
      next: forms => {
        this.forms = forms;
      }
    });

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe({
      next: this.onSelectedFormChanged.bind(this)
    });

    this.headerSideStyle = this.createheaderSideStyle();
    this.headerSideOverlayStyle = this.createheaderSideOverlayStyle();

    this.scrollerOptions = this.createScrollOptions();
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

  public closeForm(form: FormWrapper | null): void {
    if (form != null) {
      this._formsService.closeFormByButton(form);
    }
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.tabs != null) {
        const selectedTab: HTMLLIElement | null = this.tabs.nativeElement.querySelector('div.active');
        if (selectedTab) {
          selectedTab.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    });
  }
}
