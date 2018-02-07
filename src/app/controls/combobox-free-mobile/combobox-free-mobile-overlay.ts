import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector } from '@angular/cdk/portal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { IOverlayConfig, OverlayService } from 'app/services/overlay-service';
import { DataList } from 'app/common/data-list';
import { ComboBoxFreeMobileOverlayRef } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay.ref';
import { ComboBoxFreeMobileOverlayComponent } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay.component';
import { CMBBOX_DATA } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay.tokens';

export interface IComboBoxFreeMobileOverlayData {
  entries: DataList;
  selectedIndex?: number;
  value?: string;
}

export interface IComboBoxFreeMobileOverlayClosedData {
  selected: boolean;
  index?: number;
  value?: string;
}

export interface IComboBoxFreeMobileOverlayConfig extends IOverlayConfig {
  comboBoxData?: IComboBoxFreeMobileOverlayData;
}

const DEFAULT_CMBBOX_CONFIG: IComboBoxFreeMobileOverlayConfig = {
  panelClass: 'hc-cmb-free-mobile-overlay',
  comboBoxData: null
};

@Injectable()
export class ComboBoxFreeMobileOverlay extends OverlayService<ComboBoxFreeMobileOverlayComponent> {

  public openCmbBoxOverlay(config: IComboBoxFreeMobileOverlayConfig = {}): ComboBoxFreeMobileOverlayRef {
    const onClosedSource: Subject<IComboBoxFreeMobileOverlayClosedData> = new Subject<IComboBoxFreeMobileOverlayClosedData>();
    const onClosed$: Observable<IComboBoxFreeMobileOverlayClosedData> = onClosedSource.asObservable();
    const cmbBoxRef: ComboBoxFreeMobileOverlayRef = new ComboBoxFreeMobileOverlayRef(onClosed$);

    const dialogConfig: IComboBoxFreeMobileOverlayConfig = { ...DEFAULT_CMBBOX_CONFIG, ...config };
    const overlayRef: OverlayRef = this.createOverlay(dialogConfig);
    const injector: PortalInjector = this.createInjector(overlayRef, dialogConfig);
    const comp: ComboBoxFreeMobileOverlayComponent = this.attachDialogContainer(overlayRef, injector, ComboBoxFreeMobileOverlayComponent);

    comp.onFinished.subscribe(data => {
      onClosedSource.next(data);
      onClosedSource.complete();
      overlayRef.dispose();
    });

    return cmbBoxRef;
  }

  protected createInjector(overlayRef: OverlayRef, config: IComboBoxFreeMobileOverlayConfig): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(OverlayRef, overlayRef);
    injectionTokens.set(CMBBOX_DATA, config.comboBoxData);

    return new PortalInjector(this.getInjector(), injectionTokens);
  }
}
