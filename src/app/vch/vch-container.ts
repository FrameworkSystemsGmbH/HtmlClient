import { VchControl, VchManager } from '.';
import { BaseWrapper, ContainerWrapper } from '../wrappers';

export class VchContainer extends VchControl {

  private children: BaseWrapper[] = new Array<BaseWrapper>();
  private orderedChildren: Array<BaseWrapper> = null;
  private modifiedChildren: Array<BaseWrapper> = null;

  constructor(private container: ContainerWrapper) {
    super();
  }

  public setOrderedChildren(orderedChildren: BaseWrapper[]): void {
    this.orderedChildren = orderedChildren;
    VchManager.add(this.container);
  }

  public getOrderedChildren(): BaseWrapper[] {
    return this.orderedChildren ? this.orderedChildren : this.children;
  }

  public getChildren(): BaseWrapper[] {
    return this.children;
  }

  public getChildrenInFlowDirection(): BaseWrapper[] {
    if (this.container.getInvertFlowDirection()) {
      let result: BaseWrapper[] = this.children.clone();
      return result ? result.reverse() : result;
    } else {
      return this.children;
    }
  }

  public getChildrenCount(): number {
    return this.children.length;
  }

  public getChildAt(index: number): BaseWrapper {
    return index < this.getChildrenCount() ? this.children[index] : null;
  }

  public resume(): void {

    if (this.orderedChildren) {
      this.initializeModifiedChildren();
      // Beispiel:
      // OrderChildren = C39157B
      // ModfiedChildren = 0123456789A

      // 1. Hashset für die Items in der gewünschten Reihenfolge aufbauen
      let orderedChildrenSet: Set<BaseWrapper> = new Set<BaseWrapper>(this.orderedChildren);

      // 2. Hashset für die real existierenden Items aufbauen
      let modifiedChildrenSet: Set<BaseWrapper> = new Set<BaseWrapper>(this.modifiedChildren);

      // 3. Listen für die Schnittmenge aufbauen (Reihenfolge ist wichtig!)
      let orderedResult: Array<BaseWrapper> = new Array<BaseWrapper>();
      let modifiedResult: Array<BaseWrapper> = new Array<BaseWrapper>();

      for (let wrapper of this.orderedChildren) {
        if (modifiedChildrenSet.has(wrapper)) {
          orderedResult.push(wrapper);
        }
      }

      for (let wrapper of this.modifiedChildren) {
        if (orderedChildrenSet.has(wrapper)) {
          modifiedResult.push(wrapper);
        }
      }
      // Beispiel:
      // OrderResult = 39157
      // ModifiedResult = 13579

      // 4. ModifiedChildren durchlaufen und die Items aus der Schnittmenge
      // entsprechend der Position ersetzen
      for (let i = 0; i < this.modifiedChildren.length; i++) {
        let index = modifiedResult.indexOf(this.modifiedChildren[i]);
        if (index >= 0) {
          this.modifiedChildren[i] = orderedResult[index];
        }
      }

      // Beispiel:
      // Ergebnis = 0329416587A
    }

    if (this.modifiedChildren) {
      this.children = this.modifiedChildren;
    }

    this.orderedChildren = null;
    this.modifiedChildren = null;
  }

  private initializeModifiedChildren(): void {
    if (!this.modifiedChildren) {
      this.modifiedChildren = new Array<BaseWrapper>();
      this.modifiedChildren.pushAll(this.children);
    }
  }

  public addChild(wrapper: BaseWrapper): void {
    // Zuerst das Child aus seinem ursprünglichen Parent entfernen, falls noch nicht geschehen.
    let oldParent: ContainerWrapper = wrapper.getVchControl().getParent();

    if (oldParent) {
      oldParent.getVchContainer().removeChild(wrapper);
    }

    // Nun kann das eigentliche Einfügen beginnen.
    this.initializeModifiedChildren();

    this.modifiedChildren.push(wrapper);

    wrapper.getVchControl().setParent(this.container);

    VchManager.add(this.container);
  }

  public removeChild(wrapper: BaseWrapper): void {
    this.initializeModifiedChildren();
    let i: number = this.modifiedChildren.indexOf(wrapper);

    if (i >= 0) {
      this.modifiedChildren.splice(i, 1);
    }

    VchManager.add(this.container);
  }
}
