import { ControlVisibility, HorizontalAlignment, VerticalAlignment, HorizontalContentAlignment, VerticalContentAlignment } from '../enums';
import { DockOrientation } from '../layout/dock-layout';

export class PropertyLayer {

  public id: string;
  public name: string;
  public title: string;

  public visibility: ControlVisibility;

  public backgroundColor: string;

  public minWidth: number;
  public minHeight: number;
  public maxWidth: number;
  public maxHeight: number;

  public marginLeft: number;
  public marginRight: number;
  public marginTop: number;
  public marginBottom: number;

  public paddingLeft: number;
  public paddingRight: number;
  public paddingTop: number;
  public paddingBottom: number;

  public borderColor: string;
  public borderThicknessLeft: number;
  public borderThicknessRight: number;
  public borderThicknessTop: number;
  public borderThicknessBottom: number;

  public horizontalAlignment: HorizontalAlignment;
  public verticalAlignment: VerticalAlignment;
  public horizontalContentAlignment: HorizontalContentAlignment;
  public verticalContentAlignment: VerticalContentAlignment;

  public dockItemSize: number;
  public dockOrientation: DockOrientation;

}
