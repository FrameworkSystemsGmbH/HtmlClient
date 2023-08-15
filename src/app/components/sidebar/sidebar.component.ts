import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '@app/services/forms.service';
import { PlatformService } from '@app/services/platform.service';
import { IAppState } from '@app/store/app.state';
import { toggleSidebar } from '@app/store/runtime/runtime.actions';
import { selectSidebarVisible, selectTitle } from '@app/store/runtime/runtime.selectors';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'hc-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
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
export class SidebarComponent implements OnInit, OnDestroy {

  public iconTimes: IconDefinition = faTimes;

  public appTitle: string | null = String.empty();
  public forms: Array<FormWrapper> | null = null;
  public selectedForm: FormWrapper | null = null;
  public sidebarEnabled: boolean = false;
  public sidebarVisible: boolean = false;

  public headerSideStyle: any;
  public headerSideOverlayStyle: any;

  private readonly _formsService: FormsService;
  private readonly _platformService: PlatformService;
  private readonly _store: Store<IAppState>;

  private _titleSub: Subscription | null = null;

  private _formsSub: Subscription | null = null;
  private _selectedFormSub: Subscription | null = null;

  private _sidebarVisibleSub: Subscription | null = null;

  public constructor(
    formsService: FormsService,
    platformService: PlatformService,
    store: Store<IAppState>
  ) {
    this._formsService = formsService;
    this._platformService = platformService;
    this._store = store;
  }

  public ngOnInit(): void {
    this._titleSub = this._store.select(selectTitle).subscribe(title => {
      this.appTitle = title;
    });

    this._formsSub = this._formsService.getForms().subscribe(forms => {
      this.forms = forms;
    });

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.selectedForm = form;
    });

    this._sidebarVisibleSub = this._store.select(selectSidebarVisible).subscribe(sidebarVisible => {
      this.sidebarVisible = sidebarVisible;
    });

    this.headerSideStyle = this.createheaderSideStyle();
    this.headerSideOverlayStyle = this.createheaderSideOverlayStyle();
  }

  public ngOnDestroy(): void {
    this._titleSub?.unsubscribe();
    this._formsSub?.unsubscribe();
    this._selectedFormSub?.unsubscribe();
    this._sidebarVisibleSub?.unsubscribe();
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

  public toggleSidebar(): void {
    this._store.dispatch(toggleSidebar());
  }

  public selectForm(event: any, form: FormWrapper): void {
    const target: HTMLElement | null = event.target;

    if (target && DomUtil.isInClass(target, 'sidebar-form-close-btn')) {
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
}
