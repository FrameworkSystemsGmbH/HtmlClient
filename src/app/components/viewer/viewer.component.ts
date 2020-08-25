import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsService } from 'app/services/forms.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/services/loader.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'hc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  animations: [
    trigger('blockerState', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ViewerComponent implements OnInit, OnDestroy {

  public isModal: boolean;
  public isLoading: boolean;
  public modalHeaderStyle: any;

  private _isLoadingSub: Subscription;
  private _selectedFormSub: Subscription;

  constructor(
    private _loaderService: LoaderService,
    private _formsService: FormsService
  ) { }

  public ngOnInit(): void {
    this._isLoadingSub = this._loaderService.onLoadingChangedDelayed.subscribe(isLoading => this.isLoading = isLoading);

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe(form => {
      this.isModal = form != null ? form.getIsModal() : false;
      this.modalHeaderStyle = { 'display': (form != null ? form.hideModalHeader() : false) ? 'none' : null };
    });
  }

  public ngOnDestroy(): void {
    if (this._isLoadingSub) {
      this._isLoadingSub.unsubscribe();
    }

    if (this._selectedFormSub) {
      this._selectedFormSub.unsubscribe();
    }
  }
}
