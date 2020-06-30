import { EventEmitter, Output, Injector, Directive, ChangeDetectorRef } from '@angular/core';

import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { LayoutableComponent } from 'app/controls/layoutable.component';
import { Visibility } from 'app/enums/visibility';
import { FocusService } from 'app/services/focus.service';

@Directive()
export abstract class ControlComponent extends LayoutableComponent {

  @Output()
  public onEnter: EventEmitter<any>;

  @Output()
  public onLeave: EventEmitter<any>;

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

    this.callOnEnter(event);
  }

  public onFocusOut(event: FocusEvent): void {
    this.isFocused = false;
    this.isOutlined = this.getWrapper().isOutlineVisible(this.isFocused);

    this.cdr.detectChanges();

    this.callOnLeave(event);
  }

  public callOnEnter(event: FocusEvent): void {
    if (this.isEditable && this.getWrapper().hasOnEnterEvent()) {
      this.onEnter.emit(event);
    }
  }

  public callOnLeave(event: FocusEvent): void {
    if (this.isEditable && this.getWrapper().hasOnLeaveEvent()) {
      this.onLeave.emit(event);
    }
  }

  public getWrapper(): ControlWrapper {
    return super.getWrapper() as ControlWrapper;
  }

  public setWrapper(wrapper: ControlWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnEnterEvent()) {
      this.onEnter = new EventEmitter<any>();
    }

    if (wrapper.hasOnLeaveEvent()) {
      this.onLeave = new EventEmitter<any>();
    }
  }

  protected updateData(wrapper: ControlWrapper): void {
    super.updateData(wrapper);
    this.isEditable = wrapper.getCurrentIsEditable();
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  public setFocus(): void {
    // Override in subclasses
  }
}
