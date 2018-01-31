import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector } from '@angular/cdk/portal';
import { ErrorBoxRef } from 'app/components/errorbox/errorbox.ref';
import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { ERRORBOX_DATA } from 'app/components/errorbox/errorbox.tokens';
import { IOverlayConfig, OverlayService } from 'app/services/overlays/overlay-service';

export interface IErrorMessage {
  message: string;
  stackTrace: string;
}

export interface IErrorBoxConfig extends IOverlayConfig {
  errorMessage?: IErrorMessage;
}

const DEFAULT_ERRORBOX_CONFIG: IErrorBoxConfig = {
  panelClass: 'hc-errorbox-overlay',
  errorMessage: null
};

@Injectable()
export class ErrorBoxService extends OverlayService<ErrorBoxComponent> {

  public openErrorBox(config: IErrorBoxConfig = {}): void {
    const dialogConfig: IErrorBoxConfig = { ...DEFAULT_ERRORBOX_CONFIG, ...config };
    const overlayRef: OverlayRef = this.createOverlay(dialogConfig);
    const errorBoxRef: ErrorBoxRef = new ErrorBoxRef(overlayRef);
    const injector: PortalInjector = this.createInjector(errorBoxRef, dialogConfig);
    this.attachDialogContainer(overlayRef, injector, ErrorBoxComponent);
  }

  protected createInjector(errorBoxRef: ErrorBoxRef, config: IErrorBoxConfig): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ErrorBoxRef, errorBoxRef);
    injectionTokens.set(ERRORBOX_DATA, config.errorMessage);

    return new PortalInjector(this.getInjector(), injectionTokens);
  }
}
