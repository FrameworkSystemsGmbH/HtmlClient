import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector } from '@angular/cdk/portal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { IOverlayConfig, OverlayService } from 'app/services/overlay-service';
import { DataList } from 'app/common/data-list';
import { ComboBoxListMobileOverlayRef } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay.ref';
import { ComboBoxListMobileOverlayComponent } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay.component';
import { CMBBOX_DATA } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay.tokens';

export interface IComboBoxListMobileOverlayData {
  entries: DataList;
  selectedIndex?: number;
}

export interface IComboBoxListMobileOverlayClosedData {
  selected: boolean;
  index?: number;
}

export interface IComboBoxListMobileOverlayConfig extends IOverlayConfig {
  comboBoxData?: IComboBoxListMobileOverlayData;
}

const DEFAULT_CMBBOX_CONFIG: IComboBoxListMobileOverlayConfig = {
  panelClass: 'hc-cmb-list-mobile-overlay',
  comboBoxData: null
};

@Injectable()
export class ComboBoxListMobileOverlay extends OverlayService<ComboBoxListMobileOverlayComponent> {

  public openCmbBoxOverlay(config: IComboBoxListMobileOverlayConfig = {}): ComboBoxListMobileOverlayRef {
    const onClosedSource: Subject<IComboBoxListMobileOverlayClosedData> = new Subject<IComboBoxListMobileOverlayClosedData>();
    const onClosed$: Observable<IComboBoxListMobileOverlayClosedData> = onClosedSource.asObservable();
    const cmbBoxRef: ComboBoxListMobileOverlayRef = new ComboBoxListMobileOverlayRef(onClosed$);

    const dialogConfig: IComboBoxListMobileOverlayConfig = { ...DEFAULT_CMBBOX_CONFIG, ...config };
    const overlayRef: OverlayRef = this.createOverlay(dialogConfig);
    const injector: PortalInjector = this.createInjector(overlayRef, dialogConfig);
    const comp: ComboBoxListMobileOverlayComponent = this.attachDialogContainer(overlayRef, injector, ComboBoxListMobileOverlayComponent);

    comp.onFinished.subscribe(data => {
      onClosedSource.next(data);
      onClosedSource.complete();
      overlayRef.dispose();
    });

    return cmbBoxRef;
  }

  protected createInjector(overlayRef: OverlayRef, config: IComboBoxListMobileOverlayConfig): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(OverlayRef, overlayRef);
    injectionTokens.set(CMBBOX_DATA, config.comboBoxData);

    return new PortalInjector(this.getInjector(), injectionTokens);
  }
}
