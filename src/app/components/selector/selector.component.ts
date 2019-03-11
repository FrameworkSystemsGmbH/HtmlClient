import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { PlatformService } from 'app/services/platform.service';

@Component({
  selector: 'hc-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

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
    this.isDisabledAttr = this.platformService.isMobile() ? true : null;
    this.setWrapperStyle();
  }

  public setWrapperStyle(): any {
    if (this.visible) {
      this.wrapperStyle = null;
    } else {
      this.wrapperStyle = {
        'display': 'none'
      };
    }
  }
}
