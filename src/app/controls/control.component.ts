import { EventEmitter, Output, Injector, ChangeDetectorRef } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutableComponent } from 'app/controls/layoutable.component';
import { Visibility } from 'app/enums/visibility';
import { FocusService } from 'app/services/focus.service';

export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public ctrlEnter: EventEmitter<any>;

  @Output()
  public ctrlLeave: EventEmitter<any>;

  public isVisible: boolean;
  public isEditable: boolean;
  public isFocused: boolean;
  public isOutlined: boolean;

  private injector: Injector;
  private focusService: FocusService;
  private cdr: ChangeDetectorRef;

  constructor(injector: Injector) {
    super();
    this.injector = injector;
    this.init();
  }

  protected init(): void {
    this.focusService = this.injector.get(FocusService);
    // tslint:disable-next-line: deprecation
    this.cdr = this.injector.get(ChangeDetectorRef);
  }

  protected getInjector(): Injector {
    return this.injector;
  }

  protected getFocusService(): FocusService {
    return this.focusService;
  }

  public onFocusIn(event: FocusEvent): void {
    this.isFocused = true;
    this.isOutlined = this.getWrapper().isOutlineVisible(this.isFocused);

    this.cdr.detectChanges();

    this.callCtrlEnter(event);
  }

  public onFocusOut(event: FocusEvent): void {
    this.isFocused = false;
    this.isOutlined = this.getWrapper().isOutlineVisible(this.isFocused);

    this.cdr.detectChanges();

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

  public setWrapper(wrapper: ControlWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnEnterEvent()) {
      this.ctrlEnter = new EventEmitter<any>();
    }

    if (wrapper.hasOnLeaveEvent()) {
      this.ctrlLeave = new EventEmitter<any>();
    }
  }

  protected updateData(wrapper: ControlWrapper): void {
    super.updateData(wrapper);
    this.isEditable = wrapper.getCurrentIsEditable();
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  public getFocusElement(): any {
    // Override in subclasses
    return null;
  }
}
