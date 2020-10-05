import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlatformService } from '@app/services/platform.service';
import * as StyleUtil from '@app/util/style-util';

@Component({
  selector: 'hc-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  private sizeValue: number;

  @Input()
  public get size(): number {
    return this.sizeValue != null && this.sizeValue > 0 ? Math.min(20, this.sizeValue) : 20;
  }

  public set size(val: number) {
    this.sizeValue = val;
    this.setWrapperStyle();
  }

  private enabledValue: boolean;

  @Input()
  public get enabled(): boolean {
    return this.enabledValue;
  }

  public set enabled(val: boolean) {
    this.enabledValue = val;
    this.setWrapperStyle();
  }

  private visibleValue: boolean;

  @Input()
  public get visible(): boolean {
    return this.visibleValue;
  }

  public set visible(val: boolean) {
    this.visibleValue = val;
    this.setWrapperStyle();
  }

  private checkedValue: boolean;

  @Input()
  public get checked(): boolean {
    return this.checkedValue;
  }

  public set checked(val: boolean) {
    if (this.checkedValue === val) {
      return;
    }

    this.checkedValue = val;
    this.checkedChange.emit(val);
  }

  @Output()
  public checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isDisabledAttr: boolean;
  public wrapperStyle: any;

  constructor(private platformService: PlatformService) { }

  public ngOnInit(): void {
    this.setWrapperStyle();
  }

  private setWrapperStyle(): void {
    if (this.visible) {
      this.wrapperStyle = {
        'width.rem': StyleUtil.pixToRem(this.size),
        'height.rem': StyleUtil.pixToRem(this.size),
        'cursor': this.enabled ? 'pointer' : 'not-allowed'
      };
    } else {
      this.wrapperStyle = {
        'display': 'none'
      };
    }

    this.isDisabledAttr = this.platformService.isNative() || !this.enabled ? true : null;
  }
}
