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

  private _focusActions: Array<() => void> = new Array<() => void>();

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

    let reportId: string | null = null;
    let viewDocumentUrl: string | null = null;

    this.clearFocusActions();

    for (const actionJson of actionsJson) {
      if (actionJson.form != null && actionJson.control != null) {
        const form: FormWrapper | null = this._formsService.findFormById(actionJson.form);
        if (form != null) {
          const control: ControlWrapper | null = form.findControlRecursive(actionJson.control);
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
                (control as TabbedWindowWrapper).setIsEditableAtAction(actionJson.pos, actionJson.value);
                break;
              case 'SetFocus':
                this._focusActions.push(control.setFocus.bind(control));
                break;
              case 'SetVisible':
                control.setVisibilityAction(actionJson.value);
                break;
              case 'SetImageUrl':
                (control as PictureWrapper).setImageUrlAction(actionJson.value);
                break;
              case 'SetImageBytes':
                (control as PictureWrapper).setImageBytesAction(actionJson.value);
                break;
            }
          } else {
            switch (actionJson.name) {
              case 'SetTitle':
                form.setTitleAction(actionJson.value);
                break;
            }
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

    if (reportId != null && reportId.trim().length) {
      this._printReportService.printReport(reportId);
    }

    if (viewDocumentUrl != null && viewDocumentUrl.trim().length) {
      this._viewDocService.viewDocument(viewDocumentUrl);
    }
  }

  public processFocusActions(): void {
    for (const focusAction of this._focusActions) {
      focusAction();
    }

    this.clearFocusActions();
  }

  private clearFocusActions(): void {
    this._focusActions = new Array<() => void>();
  }
}
