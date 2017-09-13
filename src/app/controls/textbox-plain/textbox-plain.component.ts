import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { TextBoxPlainWrapper } from '../../wrappers';
import { StringFormatService } from '../../services/formatter/string-format.service';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxBaseComponent implements OnInit {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(
    private stringFormatService: StringFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public onInput(event: any): void {
    this.value = this.formatValue(this.value);
  }

  public callOnEnter(event: any): void {
    super.callOnEnter(event);
  }

  public callOnLeave(event: any): void {
    this.updateWrapper();
    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public getStyles(): any {
    return super.getStyles();
  }

  private formatValue(value: string): string {
    return this.stringFormatService.formatString(value, this.getWrapper().getFormat());
  }

  public updateComponent(): void {
    this.value = this.formatValue(this.getWrapper().getValue());
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }
}
