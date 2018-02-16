import { ViewContainerRef, ComponentRef } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { ContainerWrapper } from 'app/wrappers/container-wrapper';
import { ControlLabelWrapper } from 'app/wrappers/control-labels/control-label-wrapper';
import { ControlLabelContainerWrapper } from 'app/wrappers/control-labels/control-label-container-wrapper';
import { FieldPanelWrapper } from 'app/wrappers/field-panel-wrapper';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { ControlLabelContainerMergedWrapper } from './control-labels/control-label-container-merged-wrapper';

export class FieldRowWrapper extends ContainerWrapper implements IFieldRowControl {

  private hasFirstColumnControl: boolean;

  private readonly whitespaceRegEx: RegExp = /\s{1}/;

  public getFieldRowSize(): number {
    const fieldRowSize: number = this.getPropertyStore().getFieldRowSize();
    return fieldRowSize != null ? fieldRowSize : null;
  }

  public getFieldRowLabelMode(): FieldRowLabelMode {
    const labelMode: FieldRowLabelMode = this.getPropertyStore().getLabelMode();
    return labelMode != null ? labelMode : FieldRowLabelMode.Generated;
  }

  public getOptimizeGeneratedLabels(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getOptimizeGeneratedLabels());
  }

  protected createControlLabelWrapper(): ILayoutableControlWrapper {
    const wrappers: Array<ControlWrapper> = this.controls;
    const labelWrappers: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    for (const wrapper of wrappers) {
      if (wrapper.providesControlLabelWrapper()) {
        const labelWrapper: ControlLabelWrapper = wrapper.getControlLabelWrapper() as ControlLabelWrapper;
        if (labelWrapper) {
          labelWrappers.push(labelWrapper);
        }
      }
    }

    if (labelWrappers && labelWrappers.length) {
      if (this.getOptimizeGeneratedLabels()) {
        this.optimizeLabels(labelWrappers);
      }
      return new ControlLabelContainerMergedWrapper(this.getInjector(), labelWrappers, this.getParent().getRowLabelTemplate());
    } else {
      return null;
    }
  }

  public getHasFirstColumnControl(): boolean {
    return this.hasFirstColumnControl;
  }

  public getParent(): FieldPanelWrapper {
    return super.getParent() as FieldPanelWrapper;
  }

  public getFieldContainer(): IFieldContainer {
    return this.getParent() as IFieldContainer;
  }

  public getViewContainerRef(): ViewContainerRef {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public createComponent(container: ILayoutableContainerWrapper): ComponentRef<ControlComponent> {
    throw new Error('FieldRowWrapper never gets rendered to the UI! This method should not be called!');
  }

  public attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    // The FieldRow only attaches itself to the VCH since it does not render a UI Component
    vchContainer.getVchContainer().addChild(this);

    // 1. All UI Components of the children get directly attached to the FieldPanel
    // 2. All child wrappers get attached to the FieldRow in the VCH
    this.attachSubComponents(uiContainer, this);
  }

  protected attachSubComponents(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void {
    const labelMode: FieldRowLabelMode = this.getFieldRowLabelMode();
    const wrappers: Array<ControlWrapper> = this.controls;
    const labelsToOptimize: Array<ControlLabelWrapper> = new Array<ControlLabelWrapper>();

    // Reset first column indicator
    this.hasFirstColumnControl = false;

    // Create the merged label and attach it if necessary
    if (labelMode === FieldRowLabelMode.GeneratedMerged) {
      const mergedLabel: ILayoutableControlWrapper = this.getControlLabelWrapper();
      if (mergedLabel) {
        this.hasFirstColumnControl = true;
        mergedLabel.attachComponent(uiContainer, vchContainer);
      }
    }

    // Create labels and add wrappers depending on LabelMode
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper: ControlWrapper = wrappers[i];
      if (labelMode === FieldRowLabelMode.Generated && wrapper.providesControlLabelWrapper()) {
        const controlLabelWrapper: ControlLabelWrapper = wrapper.getControlLabelWrapper() as ControlLabelWrapper;
        if (controlLabelWrapper) {
          if (this.getOptimizeGeneratedLabels()) {
            labelsToOptimize.push(controlLabelWrapper);
          }
          if (i === 0) {
            this.hasFirstColumnControl = true;
            const controlLabelContainerWrapper: ControlLabelContainerWrapper = new ControlLabelContainerWrapper(
              this.getInjector(), controlLabelWrapper, this.getParent().getRowLabelTemplate());
            controlLabelContainerWrapper.attachComponent(uiContainer, vchContainer);
          } else {
            controlLabelWrapper.attachComponent(uiContainer, vchContainer);
          }
        }
      }

      if (labelMode === FieldRowLabelMode.NoneAligned) {
        this.hasFirstColumnControl = true;
      }

      wrapper.attachComponent(uiContainer, vchContainer);
    }

    if (labelsToOptimize.length) {
      this.optimizeLabels(labelsToOptimize);
    }
  }

  private optimizeLabels(labelWrappers: Array<ControlLabelWrapper>): void {
    // Check if there is anything to do
    if (!labelWrappers || !labelWrappers.length) {
      return;
    }

    // Check equality from left side
    let equalizedCaption: string = labelWrappers[0].getCaption();
    for (let i = 1; i < labelWrappers.length; i++) {
      const checkCaption: string = labelWrappers[i].getCaption();
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
      for (let i = 1; i < labelWrappers.length; i++) {
        const labelWrapper: ControlLabelWrapper = labelWrappers[i];
        const reducedCaption: string = labelWrapper.getCaption().substring(equalizedCaption.length);
        labelWrapper.setDisplayCaption(reducedCaption);
      }
    } else {
      // If no equality from left side has been detected -> check from right side
      equalizedCaption = labelWrappers[0].getCaption();
      for (let i = 1; i < labelWrappers.length; i++) {
        const checkCaption: string = labelWrappers[i].getCaption();
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
        for (let i = 0; i < labelWrappers.length - 1; i++) {
          const labelWrapper: ControlLabelWrapper = labelWrappers[i];
          const orgCaption: string = labelWrapper.getCaption();
          const reducedCaption: string = orgCaption.substring(0, orgCaption.length - length);
          labelWrapper.setDisplayCaption(reducedCaption);
        }
      }
    }
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
