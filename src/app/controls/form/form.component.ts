import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';

@Component({
  standalone: true,
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [
    CommonModule
  ]
})
export class FormComponent extends ContainerComponent implements AfterViewChecked {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef | null = null;

  public scrollerStyle: any;
  public contentStyle: any;

  public ngAfterViewChecked(): void {
    if (this.getWrapper().getFirstLayoutDone()) {
      this.getWrapper().applyFocus();
    }
  }

  public getWrapper(): FormWrapper {
    return super.getWrapper() as FormWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    if (this.anchor == null) {
      throw new Error('Tried to access uninitialized ViewContainerRef of \'FormComponent\'');
    }

    return this.anchor;
  }

  protected updateStyles(wrapper: FormWrapper): void {
    super.updateStyles(wrapper);
    this.scrollerStyle = this.createScrollerStyle(wrapper);
    this.contentStyle = this.createContentStyle(wrapper);
  }

  protected createScrollerStyle(wrapper: FormWrapper): any {
    const layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'overflow-x': layoutableProperties.getHBarNeeded() ? 'scroll' : 'hidden',
      'overflow-y': 'auto'
    };
  }

  protected createContentStyle(wrapper: FormWrapper): any {
    return {
      'backgroundColor': wrapper.getBackColor()
    };
  }
}
