import { ComponentRef, ComponentFactoryResolver, ComponentFactory, ViewContainerRef } from '@angular/core';

import { IControlLabelContainerMerged } from 'app/layout/control-label-merged-layout/control-label-container-merged.interface';
import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IControlsService } from 'app/services/controls.service';

import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { VchControl } from 'app/vch/vch-control';
import { TextAlign } from 'app/enums/text-align';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { VchContainer } from 'app/vch/vch-container';
import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { ControlLabelContainerMergedLayout } from 'app/layout/control-label-merged-layout/control-label-container-merged-layout';
import { ControlLabelContainerMergedComponent } from 'app/controls/control-label-container-merged/control-label-container-merged.component';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelSeparatorProvider } from 'app/wrappers/control-labels/control-label-separator-provider';
import { ControlLabelTemplate } from 'app/wrappers/control-labels/control-label-template';

export class ControlLabelContainerMergedWrapper implements ILayoutableControlWrapper, IControlLabelContainerMerged {

  private readonly propError: string = 'This property should not get called!';

  private name: string;
  private vchControl: VchControl;
  private layout: LayoutContainerBase;
  private layoutableProperties: LayoutablePropertiesDefault;
  private resolver: ComponentFactoryResolver;
  private componentRef: ComponentRef<ControlLabelContainerMergedComponent>;
  private labelWrappers: Array<ControlLabelWrapper>;
  private controlsService: IControlsService;
  private rowLabelTemplate: ControlLabelTemplate;
  private optimizeGeneratedLabels: boolean;

  private readonly whitespaceRegEx: RegExp = /\s{1}/;

  constructor(
    labelWrappers: Array<ControlLabelWrapper>,
    resolver: ComponentFactoryResolver,
    controlsService: IControlsService,
    rowLabelTemplate: ControlLabelTemplate,
    optimizeGeneratedLabels: boolean
  ) {
    this.labelWrappers = labelWrappers;
    this.resolver = resolver;
    this.controlsService = controlsService;
    this.rowLabelTemplate = rowLabelTemplate;
    this.optimizeGeneratedLabels = optimizeGeneratedLabels;

    // Init name
    this.name = String.empty();
    for (const labelWrapper of this.labelWrappers) {
      this.name += labelWrapper.getName() + '_';
    }
    this.name += 'MergedLabel';

    this.initLabels();
  }

  private initLabels(): void {
    // Optimize labels if desired
    if (this.optimizeGeneratedLabels) {
      // Check equality from left side
      let equalizedCaption: string = this.labelWrappers[0].getCaption();
      for (let i = 1; i < this.labelWrappers.length; i++) {
        const checkCaption: string = this.labelWrappers[i].getCaption();
        const length: number = this.startEqualsLength(equalizedCaption, checkCaption);
        if (length > 0) {
          equalizedCaption = equalizedCaption.substring(0, length);
        } else {
          equalizedCaption = null;
          break;
        }
      }

      // If equality from left side has been detected -> reduce captions
      if (!!equalizedCaption) {
        for (let i = 1; i < this.labelWrappers.length; i++) {
          const labelWrapper: ControlLabelWrapper = this.labelWrappers[i];
          const reducedCaption: string = labelWrapper.getCaption().substring(equalizedCaption.length);
          labelWrapper.setDisplayCaption(reducedCaption);
        }
      } else {
        // If no equality from left side has been detected -> check from right side
        equalizedCaption = this.labelWrappers[0].getCaption();
        for (let i = 1; i < this.labelWrappers.length; i++) {
          const checkCaption: string = this.labelWrappers[i].getCaption();
          const length: number = this.endEqualsLength(equalizedCaption, checkCaption);
          if (length > 0) {
            equalizedCaption = equalizedCaption.substring(equalizedCaption.length - length);
          } else {
            equalizedCaption = null;
            break;
          }
        }

        // If equality from right side has been detected -> reduce captions
        if (!!equalizedCaption) {
          for (let i = 0; i < this.labelWrappers.length - 1; i++) {
            const labelWrapper: ControlLabelWrapper = this.labelWrappers[i];
            const orgCaption: string = labelWrapper.getCaption();
            const reducedCaption: string = orgCaption.substring(0, orgCaption.length - length);
            labelWrapper.setDisplayCaption(reducedCaption);
          }
        }
      }
    }

    // Add separators
    const labelsWithSeparators: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    for (let i = 0; i < this.labelWrappers.length; i++) {
      if (i > 0) {
        labelsWithSeparators.push(this.controlsService.createControlLabelSeparatorWrapper(new ControlLabelSeparatorProvider(this.rowLabelTemplate)));
      }
      labelsWithSeparators.push(this.labelWrappers[i]);
    }

    this.labelWrappers = labelsWithSeparators;
  }

  public getVchControl(): VchControl {
    if (!this.vchControl) {
      this.vchControl = this.createVchControl();
    }
    return this.vchControl;
  }

  public getVchContainer(): VchContainer {
    return this.getVchControl() as VchContainer;
  }

  protected createVchControl(): VchControl {
    return new VchContainer(this);
  }

  protected getResolver(): ComponentFactoryResolver {
    return this.resolver;
  }

  public getLayout(): LayoutContainerBase {
    if (!this.layout) {
      this.layout = this.createLayout();
    }
    return this.layout;
  }

  protected createLayout(): LayoutContainerBase {
    return new ControlLabelContainerMergedLayout(this);
  }

  public getLayoutableProperties(): LayoutablePropertiesDefault {
    if (!this.layoutableProperties) {
      this.layoutableProperties = this.createLayoutableProperties();
    }
    return this.layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutablePropertiesDefault {
    return new LayoutablePropertiesDefault(this);
  }

  public getLayoutableControls(): Array<ILayoutableControl> {
    return this.labelWrappers;
  }

  protected getComponentRef(): ComponentRef<ControlLabelContainerMergedComponent> {
    return this.componentRef;
  }

  protected setComponentRef(componentRef: ComponentRef<ControlLabelContainerMergedComponent>): void {
    this.componentRef = componentRef;
  }

  protected getComponent(): ControlLabelContainerMergedComponent {
    const compRef: ComponentRef<ControlLabelContainerMergedComponent> = this.getComponentRef();
    return compRef ? compRef.instance : undefined;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.getComponent().anchor;
  }

  public getName(): string {
    return this.name;
  }

  public getInvertFlowDirection(): boolean {
    return false;
  }

  public getTextAlign(): TextAlign {
    return this.rowLabelTemplate.getTextAlign();
  }

  public getForeColor(): string {
    throw new Error(this.propError);
  }

  public getBackColor(): string {
    throw new Error(this.propError);
  }

  public getVisibility(): ControlVisibility {
    return ControlVisibility.Visible;
  }

  public getMinLayoutWidth(): number {
    return this.getLayout().measureMinWidth();
  }

  public getMinLayoutHeight(width: number): number {
    return this.getLayout().measureMinHeight(width);
  }

  public getMaxLayoutWidth(): number {
    return this.getLayout().measureMaxWidth();
  }

  public getMaxLayoutHeight(): number {
    return this.getLayout().measureMaxHeight();
  }

  public getMinWidth(): number {
    throw new Error(this.propError);
  }

  public getMinHeight(): number {
    throw new Error(this.propError);
  }

  public getMaxWidth(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  public getMaxHeight(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  public getMarginLeft(): number {
    return 0;
  }

  public getMarginRight(): number {
    return 0;
  }

  public getMarginTop(): number {
    return 0;
  }

  public getMarginBottom(): number {
    return 0;
  }

  public getInsetsLeft(): number {
    throw new Error(this.propError);
  }

  public getInsetsRight(): number {
    throw new Error(this.propError);
  }

  public getInsetsTop(): number {
    throw new Error(this.propError);
  }

  public getInsetsBottom(): number {
    throw new Error(this.propError);
  }

  public getDockItemSize(): number {
    return null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return HorizontalAlignment.Left;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return VerticalAlignment.Top;
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlLabelContainerMergedComponent> {
    const factory: ComponentFactory<ControlLabelContainerMergedComponent> = this.getResolver().resolveComponentFactory(ControlLabelContainerMergedComponent);
    return factory.create(container.getViewContainerRef().injector);
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // If this wrapper is already attached -> detach and destroy old Angular Component
    const oldCompRef: ComponentRef<ControlLabelContainerMergedComponent> = this.getComponentRef();

    if (oldCompRef != null) {
      oldCompRef.destroy();
    }

    // Create the Angular Component
    const compRef: ComponentRef<ControlLabelContainerMergedComponent> = this.createComponent(uiContainer);
    const compInstance: ControlLabelContainerMergedComponent = compRef.instance;

    // Link wrapper with component
    this.setComponentRef(compRef);

    // Link component with wrapper
    compInstance.setWrapper(this);

    // Register onDestroy handler of the Angular component
    compRef.onDestroy(this.detachComponent.bind(this));

    // Insert the Angular Component into the DOM
    uiContainer.getViewContainerRef().insert(compRef.hostView);

    // Insert the wrapper into the VCH
    vchContainer.getVchContainer().addChild(this);

    this.attachSubComponents(this, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    for (const labelWrapper of this.labelWrappers) {
      labelWrapper.attachComponent(uiContainer, vchContainer);
    }
  }

  protected detachComponent(): void {
    // Detach wrapper from VCH
    const vchParent: ILayoutableContainerWrapper = this.getVchControl().getParent();

    if (vchParent) {
      vchParent.getVchContainer().removeChild(this);
    }

    // Clear the Angular Component reference
    this.componentRef = null;
  }

  // Returns the number of identical chars from the left up to a whitespace
  private startEqualsLength(s1: string, s2: string): number {
    if (!s1 || !s2) {
      return 0;
    }

    const length: number = Math.min(s1.length, s2.length);

    for (let i = 0; i < length; i++) {
      if (s1.charAt(i) !== s2.charAt(i)) {
        while (i > 0 && !this.whitespaceRegEx.test(s1.charAt(i - 1))) {
          i--;
        }
        return i;
      }
    }

    return length;
  }

  // Returns the number of identical chars from the right up to a whitespace
  private endEqualsLength(s1: string, s2: string): number {
    if (!s1 || !s2) {
      return 0;
    }

    const l1: number = s1.length;
    const l2: number = s2.length;
    const length = Math.min(l1, l2);

    for (let i = 1; i <= length; i++) {
      if (s1.charAt(l1 - i) !== s2.charAt(l2 - i)) {
        i--;
        while (i > 0 && !this.whitespaceRegEx.test(s1.charAt(l1 - i))) {
          i--;
        }
        return i;
      }
    }

    return length;
  }
}
