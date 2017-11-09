import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';
import { HorizontalContentAlignment } from '../enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '../enums/vertical-content-alignment';
import { ContentAlignment } from '../enums/content-alignment';
import { DataSourceType } from '../enums/datasource-type';
import { DockOrientation } from '../layout/dock-layout/dock-orientation';
import { TextFormat } from '../enums/text-format';
import { FsSize } from './fs-size';
import { PictureScaleMode } from '../enums/picture-scale-mode';
import { ScrollBars } from '../enums/scrollbars';
import { TextAlign } from '../enums/text-align';
import { ControlVisibility } from '../enums/control-visibility';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { WrapArrangement } from '../layout/wrap-layout/wrap-arrangement';

export class PropertyData {

  public measureText: string;
  public minWidthRaster: number;
  public maxWidthRaster: number;

  public foreColor: string;
  public backColor: string;
  public disabledBackColor: string;
  public borderColor: string;

  public minWidth: number;
  public minHeight: number;
  public maxWidth: number;
  public maxHeight: number;

  public displayMinLines: number;
  public displayMaxLines: number;
  public displayMinLength: number;
  public displayMaxLength: number;

  public marginLeft: number;
  public marginRight: number;
  public marginTop: number;
  public marginBottom: number;

  public borderRadiusTopLeft: number;
  public borderRadiusTopRight: number;
  public borderRadiusBottomLeft: number;
  public borderRadiusBottomRight: number;

  public borderThicknessLeft: number;
  public borderThicknessRight: number;
  public borderThicknessTop: number;
  public borderThicknessBottom: number;

  public paddingLeft: number;
  public paddingRight: number;
  public paddingTop: number;
  public paddingBottom: number;

  public alignmentHorizontal: HorizontalAlignment;
  public alignmentVertical: VerticalAlignment;
  public horizontalContentAlignment: HorizontalContentAlignment;
  public verticalContentAlignment: VerticalContentAlignment;

  public spacingHorizontal: number;
  public spacingVertical: number;

  public fontBold: boolean;
  public fontFamily: string;
  public fontItalic: boolean;
  public fontSize: number;
  public fontUnderline: boolean;

  public labelTemplate: PropertyData;
  public rowLabelTemplate: PropertyData;

  public image: string;
  public imageBack: string;
  public imageForward: string;
  public inactiveImage: string;
  public activeImage: string;
  public disabledImage: string;
  public highlightImage: string;
  public mouseOverImage: string;
  public pressedImage: string;
  public backgroundImage: string;

  public openIcon: string;
  public closedIcon: string;
  public backwardButtonIcon: string;
  public cancelButtonIcon: string;
  public forwardButtonIcon: string;
  public loadPageButtonIcon: string;
  public reloadButtonIcon: string;
  public zoomInButtonIcon: string;
  public zoomOutButtonIcon: string;
  public zoomResetButtonIcon: string;
  public newRowIcon: string;
  public rowChangedIcon: string;
  public rowDeletedIcon: string;
  public dockWindowIcon: string;

  public caption: string;
  public captionAlign: ContentAlignment;
  public dataSourceTypeID: DataSourceType;
  public dockPanel_ItemSize: number;
  public dockPanelOrientation: DockOrientation;
  public editorStyle: number;
  public fieldRowSize: number;
  public format: TextFormat;
  public formatPattern: string;
  public invertFlowDirection: boolean;
  public isCloseIconVisible: boolean;
  public isEditable: boolean;
  public isEnabled: boolean;
  public isVisible: boolean;
  public labelMode: FieldRowLabelMode;
  public mapEnterToTab: boolean;
  public maxDropDownSize: FsSize;
  public maxSize: number;
  public maxPrec: number;
  public maxScale: number;
  public multiline: boolean;
  public optimizeGeneratedLabels: boolean;
  public passwordChar: string;
  public scaleMode: PictureScaleMode;
  public scrollBars: ScrollBars;
  public shortcut: string;
  public showCaption: boolean;
  public synchronizeColumns: boolean;
  public tabStop: boolean;
  public textAlign: TextAlign;
  public title: string;
  public visibility: ControlVisibility;
  public width: number;
  public wordWrap: boolean;
  public wrapArrangement: WrapArrangement;
}
