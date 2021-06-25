import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { IFieldLayoutSynchronized } from '@app/layout/field-layout/field-layout-synchronized.interface';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { isIFieldLayoutSynchronized, isILayoutableContainer } from '@app/util/interface-util';

export class LayoutableControlWrapper {

  private readonly _name: string;

  private _minLayoutHeight: number;

  private readonly _minLayoutWidth: number;
  private readonly _maxLayoutWidth: number;
  private readonly _maxLayoutHeight: number;
  private readonly _marginLeft: number;
  private readonly _marginRight: number;
  private readonly _marginTop: number;
  private readonly _marginBottom: number;
  private readonly _dockItemSize: number;

  private readonly _visibility: Visibility;
  private readonly _isControlVisible: boolean;
  private readonly _isLayoutVisible: boolean;
  private readonly _isSynchronizedHidden: boolean;

  private readonly _hAlign: HorizontalAlignment;
  private readonly _vAlign: VerticalAlignment;

  private readonly _layoutableProperties: ILayoutableProperties;

  private _resultWdith: number;
  private _resultHeight: number;

  private readonly _layout: LayoutContainerBase;

  public constructor(private readonly _control: ILayoutableControl) {
    this._name = _control.getName();
    this._layoutableProperties = _control.getLayoutableProperties();
    this._minLayoutWidth = _control.getMinLayoutWidth();
    this._maxLayoutWidth = _control.getMaxLayoutWidth();
    this._maxLayoutHeight = _control.getMaxLayoutHeight();
    this._marginLeft = _control.getMarginLeft();
    this._marginRight = _control.getMarginRight();
    this._marginTop = _control.getMarginTop();
    this._marginBottom = _control.getMarginBottom();
    this._dockItemSize = _control.getDockItemSize();
    this._hAlign = _control.getHorizontalAlignment();
    this._vAlign = _control.getVerticalAlignment();
    this._visibility = _control.getCurrentVisibility();

    this._isControlVisible = this._visibility === Visibility.Visible;
    this._isLayoutVisible = this._visibility !== Visibility.Collapsed;

    if (isILayoutableContainer(_control)) {
      this._layout = _control.getLayout();
    }

    if (isIFieldLayoutSynchronized(_control)) {
      this._isSynchronizedHidden = (_control as IFieldLayoutSynchronized).isSynchronizedHidden();
    }
  }

  public getName(): string {
    return this._name;
  }

  public getLayoutableProperties(): ILayoutableProperties {
    return this._layoutableProperties;
  }

  public getMinLayoutWidth(): number {
    return this._minLayoutWidth;
  }

  public getMinLayoutHeight(width: number): number {
    this._minLayoutHeight = this._control.getMinLayoutHeight(width);
    return this._minLayoutHeight;
  }

  public getMinLayoutHeightBuffered(): number {
    return Number.zeroIfNull(this._minLayoutHeight);
  }

  public getMaxLayoutWidth(): number {
    return this._maxLayoutWidth;
  }

  public getMaxLayoutHeight(): number {
    return this._maxLayoutHeight;
  }

  public getMarginLeft(): number {
    return this._marginLeft;
  }

  public getMarginRight(): number {
    return this._marginRight;
  }

  public getMarginTop(): number {
    return this._marginTop;
  }

  public getMarginBottom(): number {
    return this._marginBottom;
  }

  public getDockItemSize(): number {
    return this._dockItemSize;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return this._hAlign;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return this._vAlign;
  }

  public getVisibility(): Visibility {
    return this._visibility;
  }

  public getIsControlVisible(): boolean {
    return this._isControlVisible;
  }

  public getIsLayoutVisible(): boolean {
    return this._isLayoutVisible;
  }

  public getIsSynchronizedVisible(): boolean {
    return !this._isSynchronizedHidden;
  }

  public getResultWidth(): number {
    return this._resultWdith;
  }

  public setResultWidth(measuredWidth: number): void {
    this._resultWdith = Number.zeroIfNull(measuredWidth);
  }

  public getResultHeight(): number {
    return this._resultHeight;
  }

  public setResultHeight(measuredHeight: number): void {
    this._resultHeight = Number.zeroIfNull(measuredHeight);
  }

  public arrangeContainer(): void {
    if (this._layout) {
      this._layout.arrange();
    }
  }
}
