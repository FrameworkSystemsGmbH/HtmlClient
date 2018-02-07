import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector } from '@angular/cdk/portal';
import { IOverlayConfig, OverlayService } from 'app/services/overlay-service';
import { MsgBoxIcon } from 'app/enums/msgbox-icon';
import { MSGBOX_DATA } from 'app/components/msgbox/msgbox.tokens';
import { MsgBoxComponent } from 'app/components/msgbox/msgbox.component';
import { MsgBoxButtons } from 'app/enums/msgbox-buttons';

export interface IMsgBoxMessage {
  formId: string;
  id: string;
  message: string;
  icon: MsgBoxIcon;
  buttons: MsgBoxButtons;
}

export interface IMsgBoxConfig extends IOverlayConfig {
  msgBoxMessage?: IMsgBoxMessage;
}

const DEFAULT_MSGBOX_CONFIG: IMsgBoxConfig = {
  panelClass: 'hc-msgbox-overlay',
  msgBoxMessage: null
};

@Injectable()
export class MsgBoxOverlay extends OverlayService<MsgBoxComponent> {

  public openMsgBox(config: IMsgBoxConfig = {}): void {
    const dialogConfig: IMsgBoxConfig = { ...DEFAULT_MSGBOX_CONFIG, ...config };
    const overlayRef: OverlayRef = this.createOverlay(dialogConfig);
    const injector: PortalInjector = this.createInjector(overlayRef, dialogConfig);
    this.attachDialogContainer(overlayRef, injector, MsgBoxComponent);
  }

  protected createInjector(overlayRef: OverlayRef, config: IMsgBoxConfig): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(OverlayRef, overlayRef);
    injectionTokens.set(MSGBOX_DATA, config.msgBoxMessage);

    return new PortalInjector(this.getInjector(), injectionTokens);
  }
}
