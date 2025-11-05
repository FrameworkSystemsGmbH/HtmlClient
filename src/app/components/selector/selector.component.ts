import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformService } from '@app/services/platform.service';
import * as StyleUtil from '@app/util/style-util';

@Component({
  selector: 'hc-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SelectorComponent implements OnInit {

  @Input()
  public get size(): number {
    return this._sizeValue != null && this._sizeValue > 0 ? Math.min(20, this._sizeValue) : 20;
  }

  public set size(val: number) {
    this._sizeValue = val;
    this.setWrapperStyle();
  }

  @Input()
  public get enabled(): boolean {
    return this._enabledValue;
  }

  public set enabled(val: boolean) {
    this._enabledValue = val;
    this.setWrapperStyle();
  }

  @Input()
  public get visible(): boolean {
    return this._visibleValue;
  }

  public set visible(val: boolean) {
    this._visibleValue = val;
    this.setWrapperStyle();
  }

  @Input()
  public get checked(): boolean {
    return this._checkedValue;
  }

  public set checked(val: boolean) {
    if (this._checkedValue === val) {
      return;
    }

    this._checkedValue = val;
    this.checkedChange.emit(val);
  }

  @Output()
  public readonly checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public wrapperStyle: any;
  public isDisabledAttr: boolean | null = null;

  private readonly _platformService = inject(PlatformService);

  private _sizeValue: number | null = null;
  private _enabledValue: boolean = false;
  private _visibleValue: boolean = false;
  private _checkedValue: boolean = false;

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

    this.isDisabledAttr = this._platformService.isNative() || !this.enabled ? true : null;
  }
}
