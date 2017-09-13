import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { TextBoxNumberWrapper } from '../../wrappers';
import { NumberFormatService } from '../../services/formatter/number-format.service';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxBaseComponent implements OnInit {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(private numberFormatService: NumberFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public callOnEnter(event: any): void {
    super.callOnEnter(event);
  }

  public callOnLeave(event: any): void {
    if (String.isNullOrWhiteSpace(this.value)) {
      this.value = null;
      this.updateWrapper();
    } else {
      let wrapper: TextBoxNumberWrapper = this.getWrapper();
      let formattedValue: string = this.numberFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());

      if (formattedValue == null) {
        this.updateComponent();
      } else {
        this.value = formattedValue;
        this.updateWrapper();
      }
    }

    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  public getWrapper(): TextBoxNumberWrapper {
    return super.getWrapper() as TextBoxNumberWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public getStyles(): any {
    return super.getStyles();
  }

  public updateComponent(): void {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.value = this.numberFormatService.formatNumber(this.getWrapper().getValue(), wrapper.getFormat(), wrapper.getFormatPattern());
  }

  private updateWrapper(): void {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.getWrapper().setValue(this.numberFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
