import { ChangeDetectorRef, Directive, EventEmitter, Output } from '@angular/core';
import { LayoutableComponent } from '@app/controls/layoutable.component';
import { Visibility } from '@app/enums/visibility';
import { FocusService } from '@app/services/focus.service';
import { ControlWrapper } from '@app/wrappers/control-wrapper';

/** Basis Component für alle Angular Component für FS Controls. */
@Directive()
export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public readonly ctrlEnter: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public readonly ctrlLeave: EventEmitter<any> = new EventEmitter<any>();

  public isVisible: boolean = true;
  public isEditable: boolean = true;
  public isFocused: boolean = false;
  public isOutlined: boolean = false;

  private readonly _cdr: ChangeDetectorRef;
  private readonly _focusService: FocusService;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService
  ) {
    super();
    this._cdr = cdr;
    this._focusService = focusService;
  }

  protected getChangeDetectorRef(): ChangeDetectorRef {
    return this._cdr;
  }

  protected getFocusService(): FocusService {
    return this._focusService;
  }

  public onFocusIn(event: FocusEvent): void {
    const wrapper: ControlWrapper = this.getWrapper();

    this.isFocused = true;
    this.isOutlined = wrapper.isOutlineVisible(this.isFocused);

    this.updateStyles(wrapper);

    this._cdr.detectChanges();

    this.callCtrlEnter(event);
  }

  public onFocusOut(event: FocusEvent): void {
    const wrapper: ControlWrapper = this.getWrapper();

    this.isFocused = false;
    this.isOutlined = wrapper.isOutlineVisible(this.isFocused);

    this.updateStyles(wrapper);

    this._cdr.detectChanges();

    this.callCtrlLeave(event);
  }

  public callCtrlEnter(event: FocusEvent): void {
    if (this.isEditable && this.getWrapper().hasOnEnterEvent()) {
      this.ctrlEnter.emit(event);
    }
  }

  public callCtrlLeave(event: FocusEvent): void {
    if (this.isEditable && this.getWrapper().hasOnLeaveEvent()) {
      this.ctrlLeave.emit(event);
    }
  }

  public getWrapper(): ControlWrapper {
    return super.getWrapper() as ControlWrapper;
  }

  /**
   * BrokerRequest vorbei und der hat an irgendeinem Control neue Properties gegeben,
   * dann wird updateData rekursiv aufgerufen die Änderungen hatte. Un ddann kann die Component über den
   * Wrapper die Properties holen.
   */
  protected updateData(wrapper: ControlWrapper): void {
    super.updateData(wrapper);
    //Component holt sich über den Wrapper die Flags, die dann ins Template
    // (Default ChangeDetection) geht.
    this.isEditable = wrapper.getCurrentIsEditable();
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  public getFocusElement(): HTMLElement | null {
    // Override in subclasses
    return null;
  }
}
