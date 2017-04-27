import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

import { BaseComponent } from '../base.component';

@Component({
  selector: 'hc-btn',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends BaseComponent {

  public label: string;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('focus') focus: ElementRef;

  public getLabel(): string {
    return this.label;
  }

  public setLabel(label: string): void {
    this.label = label;
  }

  public callOnClick(event: any): void {
    this.onClick.emit(event);
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
