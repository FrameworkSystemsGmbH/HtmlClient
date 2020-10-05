import { AfterViewChecked, Component, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { LayoutableProperties } from '@app/wrappers/layout/layoutable-properties-default';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent implements AfterViewChecked {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  public scrollerStyle: any;
  public contentStyle: any;

  constructor(injector: Injector) {
    super(injector);
  }

  public ngAfterViewChecked(): void {
    if (this.getWrapper().getFirstLayout()) {
      this.getFocusService().applyFocusElement();
      this.getFocusService().clearFocusElement();
    }
  }

  public getWrapper(): FormWrapper {
    return super.getWrapper() as FormWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
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
