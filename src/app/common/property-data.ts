import { ContentAlignment } from '@app/enums/content-alignment';
import { DataSourceType } from '@app/enums/datasource-type';
import { DockPanelScrolling } from '@app/enums/dockpanel-scrolling';
import { EditStyle } from '@app/enums/edit-style';
import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { HorizontalContentAlignment } from '@app/enums/horizontal-content-alignment';
import { ListViewItemArrangement } from '@app/enums/listview-item-arrangement';
import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';
import { ListViewSelectorPosition } from '@app/enums/listview-selector-position';
import { PictureScaleMode } from '@app/enums/picture-scale-mode';
import { ScrollBars } from '@app/enums/scrollbars';
import { TabAlignment } from '@app/enums/tab-alignment';
import { TextAlign } from '@app/enums/text-align';
import { TextFormat } from '@app/enums/text-format';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { VerticalContentAlignment } from '@app/enums/vertical-content-alignment';
import { Visibility } from '@app/enums/visibility';
import { DockOrientation } from '@app/layout/dock-layout/dock-orientation';
import { FieldRowLabelMode } from '@app/layout/field-layout/field-row-label-mode';
import { WrapArrangement } from '@app/layout/wrap-layout/wrap-arrangement';

export class PropertyData {

  public listViewItemCssGlobal: string;
  public templateControlCssGlobal: string;

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
  public tabTemplateActive: PropertyData;
  public tabTemplateDisabled: PropertyData;
  public tabTemplateInactive: PropertyData;

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
  public datasourceOnValue: string;
  public dataSourceTypeID: DataSourceType;
  public dockPanel_ItemSize: number;
  public dockPanelOrientation: DockOrientation;
  public dockPanelScrolling: DockPanelScrolling;
  public editorStyle: number;
  public editStyle: EditStyle;
  public fieldRowSize: number;
  public format: TextFormat;
  public formatPattern: string;
  public hideModalHeader: boolean;
  public invertFlowDirection: boolean;
  public isCloseIconVisible: boolean;
  public isEditable: boolean;
  public isEnabled: boolean;
  public isVisible: boolean;
  public itemArrangement: ListViewItemArrangement;
  public itemWidth: number;
  public itemHeight: number;
  public labelMode: FieldRowLabelMode;
  public listDisplayMinLength: number;
  public listDisplayMaxLength: number;
  public listType: DataSourceType;
  public mapEnterToTab: boolean;
  public maxDropDownWidth: number;
  public maxDropDownHeight: number;
  public maxSize: number;
  public maxPrec: number;
  public maxScale: number;
  public multiline: boolean;
  public multiselect: boolean;
  public optimizeGeneratedLabels: boolean;
  public passwordChar: string;
  public scaleMode: PictureScaleMode;
  public scrollBars: ScrollBars;
  public selectionMode: ListViewSelectionMode;
  public selectorPosition: ListViewSelectorPosition;
  public shortcut: string;
  public showCaption: boolean;
  public synchronizeColumns: boolean;
  public tabAlignment: TabAlignment;
  public tabStop: boolean;
  public templateCss: string;
  public templateHtml: string;
  public textAlign: TextAlign;
  public title: string;
  public visibility: Visibility;
  public width: number;
  public wordWrap: boolean;
  public wrapArrangement: WrapArrangement;
}
