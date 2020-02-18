import { Injectable } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ButtonBaseWrapper } from 'app/wrappers/button-base-wrapper';
import { PictureWrapper } from 'app/wrappers/picture-wrapper';
import { FormWrapper } from 'app/wrappers/form-wrapper';
import { BarcodeService } from 'app/services/actions/barcode.service';
import { FormsService } from 'app/services/forms.service';
import { GeoLocationService } from 'app/services/actions/geolocation.service';
import { CameraService } from 'app/services/actions/camera.service';
import { ViewDocService } from 'app/services/actions/viewdoc.service';
import { TabbedWindowWrapper } from 'app/wrappers/tabbed-window/tabbed-window-wrapper';

@Injectable()
export class ActionsService {

  private _viewDocumentUrl: string;
  private _focusActions: Array<() => void>;

  constructor(
    private _barcodeService: BarcodeService,
    private _formsService: FormsService,
    private _geoLocationService: GeoLocationService,
    private _cameraService: CameraService,
    private _viewDocService: ViewDocService
  ) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    this._viewDocumentUrl = null;
    this._focusActions = new Array<() => void>();

    for (const actionJson of actionsJson) {
      if (actionJson.form != null && actionJson.control != null) {
        const form: FormWrapper = this._formsService.findFormById(actionJson.form);
        const control: ControlWrapper = form.findControlRecursive(actionJson.control);

        if (control) {
          switch (actionJson.name) {
            case 'SetCloseButton':
              form.setCloseButtonAction(control as ButtonBaseWrapper);
              break;
            case 'SetEnabled':
              control.setIsEditableAction(actionJson.value);
              break;
            case 'SetEnabledAt':
              const tabbedWindow: TabbedWindowWrapper = control as TabbedWindowWrapper;
              if (tabbedWindow != null) {
                tabbedWindow.setIsEditableAtAction(actionJson.pos, actionJson.value);
              }
              break;
            case 'SetFocus':
              this._focusActions.push(control.setFocus.bind(control));
              break;
            case 'SetVisible':
              control.setVisibilityAction(actionJson.value);
              break;
            case 'SetImageUrl':
              const pictureUrl: PictureWrapper = control as PictureWrapper;
              if (pictureUrl) {
                pictureUrl.setImageUrlAction(actionJson.value);
              }
              break;
            case 'SetImageBytes':
              const pictureBytes: PictureWrapper = control as PictureWrapper;
              if (pictureBytes) {
                pictureBytes.setImageBytesAction(actionJson.value);
              }
              break;
          }
        }
      } else {
        switch (actionJson.name) {
          case 'ScanBarcode':
            this._barcodeService.scan(actionJson.format);
            break;
          case 'TakePhoto':
            this._cameraService.takePhoto(actionJson.source);
            break;
          case 'GetGeoLocation':
            this._geoLocationService.getGeoLocation();
            break;
          case 'ViewDocument':
            this._viewDocumentUrl = actionJson.url;
            break;
        }
      }
    }

    if (!String.isNullOrWhiteSpace(this._viewDocumentUrl)) {
      this._viewDocService.viewDocument(this._viewDocumentUrl);
    }
  }

  public processFocusActions(): void {
    if (this._focusActions != null) {
      for (const focusAction of this._focusActions) {
        focusAction();
      }
    }
  }
}
