import {
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ContainerComponent } from '../container.component';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent {

  public title: string;

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }
}
