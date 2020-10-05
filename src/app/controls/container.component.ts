import { Directive, ViewContainerRef } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';

@Directive()
export abstract class ContainerComponent extends ControlComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
