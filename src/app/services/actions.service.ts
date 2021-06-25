import { Injectable } from '@angular/core';
import { BarcodeService } from '@app/services/actions/barcode.service';
import { CameraService } from '@app/services/actions/camera.service';
import { GeoLocationService } from '@app/services/actions/geolocation.service';
import { PrintReportService } from '@app/services/actions/print-report.service';
import { ViewDocService } from '@app/services/actions/viewdoc.service';
import { FormsService } from '@app/services/forms.service';
import { ButtonBaseWrapper } from '@app/wrappers/button-base-wrapper';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { PictureWrapper } from '@app/wrappers/picture-wrapper';
import { TabbedWindowWrapper } from '@app/wrappers/tabbed-window/tabbed-window-wrapper';

@Injectable({ providedIn: 'root' })
export class ActionsService {

  private _focusActions: Array<() => void>;

  public constructor(
    private readonly _barcodeService: BarcodeService,
    private readonly _formsService: FormsService,
    private readonly _geoLocationService: GeoLocationService,
    private readonly _cameraService: CameraService,
    private readonly _printReportService: PrintReportService,
    private readonly _viewDocService: ViewDocService
  ) { }

  public processActions(actionsJson: any): void {
    if (!actionsJson || !actionsJson.length) {
      return;
    }

    let reportId: string = null;
    let viewDocumentUrl: string = null;

    this.clearFocusActions();

    for (const actionJson of actionsJson) {
      if (actionJson.form != null && actionJson.control != null) {
        const form: FormWrapper = this._formsService.findFormById(actionJson.form);
        const control: ControlWrapper = form.findControlRecursive(actionJson.control);

        if (control) {
          switch (actionJson.name) {
            case 'SetCaption':
              control.setCaptionAction(actionJson.value);
              break;
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
        } else {
          switch (actionJson.name) {
            case 'SetTitle':
              form.setTitleAction(actionJson.value);
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
          case 'PrintReport':
            reportId = actionJson.id;
            break;
          case 'ViewDocument':
            viewDocumentUrl = actionJson.url;
            break;
        }
      }
    }

    if (!String.isNullOrWhiteSpace(reportId)) {
      this._printReportService.printReport(reportId);
    }

    if (!String.isNullOrWhiteSpace(viewDocumentUrl)) {
      this._viewDocService.viewDocument(viewDocumentUrl);
    }
  }

  public processFocusActions(): void {
    if (this._focusActions != null) {
      for (const focusAction of this._focusActions) {
        focusAction();
      }

      this.clearFocusActions();
    }
  }

  private clearFocusActions(): void {
    this._focusActions = new Array<() => void>();
  }
}
