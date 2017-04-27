import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { BaseComponent } from '../base.component';

@Component({
  selector: 'hc-lbl',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent extends BaseComponent {

  public label: string;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  public getLabel(): string {
    return this.label;
  }

  public setLabel(label: string): void {
    this.label = label;
  }

  public callOnClick(event: any): void {
    this.onClick.emit(event);
  }
}
