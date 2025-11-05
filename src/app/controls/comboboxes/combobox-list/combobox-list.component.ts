import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ComboBoxDesktopComponent } from '@app/controls/comboboxes/combobox-desktop.component';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import * as StyleUtil from '@app/util/style-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { buffer, debounceTime, map, share } from 'rxjs/operators';

@Component({
    selector: 'hc-cmb-list',
    templateUrl: './combobox-list.component.html',
    styleUrls: ['./combobox-list.component.scss'],
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    animations: [
        trigger('listState', [
            state('void', style({ opacity: 0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', animate('200ms ease-in')),
            transition('* => void', animate('150ms ease-out'))
        ])
    ]
})
export class ComboBoxListComponent extends ComboBoxDesktopComponent implements AfterViewInit, OnDestroy {

  @ViewChild('control', { static: true })
  public control: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('list', { static: true })
  public list: ElementRef<HTMLUListElement> | null = null;

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef<HTMLDivElement> | null = null;

  public iconCaretDown: IconDefinition = faCaretDown;

  public tabIndexAttr: number | null = null;
  public valueStyle: any;

  private _keyDownSub: Subscription | null = null;
  private _inputSub: Subscription | null = null;

  private readonly _regEx: RegExp = /([a-z]|\d)/i;

  public ngAfterViewInit(): void {
    if (this.control != null) {
      const keyDownObs: Observable<any> = fromEvent(this.control.nativeElement, 'keydown').pipe(share());
      const inputIdleObs: Observable<any> = keyDownObs.pipe(debounceTime(250), share());

      this._keyDownSub = keyDownObs.subscribe({
        next: event => this.onKeyDown(event)
      });

      this._inputSub = keyDownObs.pipe(
        map(event => KeyUtil.getKeyString(event)),
        buffer(inputIdleObs)
      ).subscribe({
        next: events => this.onInput(events)
      });
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this._keyDownSub?.unsubscribe();
    this._inputSub?.unsubscribe();
  }

  public getControl(): ElementRef<HTMLElement> | null {
    return this.control;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  public getSelectedPk(): string | null {
    const selectedIndex: number | null = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getWrapper().getValue();
    } else if (this.entries != null) {
      return this.entries[selectedIndex].getPk();
    } else {
      return null;
    }
  }

  public getDisplayValue(): string | null {
    const wrpValue: string | null = this.getWrapper().getValue();
    const selectedIndex: number | null = this.getSelectedIndex();

    if ((selectedIndex == null || selectedIndex < 0) && wrpValue != null && wrpValue.trim().length > 0) {
      return `## ${wrpValue} ##`;
    }

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return this.entries[selectedIndex].getValue();
    }

    return this.getPlaceholder();
  }

  public getPlaceholderShown(): boolean {
    const captionAsPlaceholder: boolean | null = this.getWrapper().getCaptionAsPlaceholder();

    if (!captionAsPlaceholder) {
      return false;
    }

    const wrpValue: string | null = this.getWrapper().getValue();
    const selectedIndex: number | null = this.getSelectedIndex();

    if ((selectedIndex == null || selectedIndex < 0) && wrpValue != null && wrpValue.trim().length > 0) {
      return false;
    }

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return false;
    }

    return true;
  }

  protected getScroller(): ElementRef<HTMLDivElement> | null {
    return this.scroller;
  }

  protected getList(): ElementRef<HTMLUListElement> | null {
    return this.list;
  }

  public onContainerMouseDown(event: any): void {
    if (this.control != null && (!event.target || !DomUtil.isDescendantOrSelf(this.control.nativeElement, event.target))) {
      event.preventDefault();
    }
  }

  public onControlClick(): void {
    if (this.isEditable) {
      if (this.dropDownVisible) {
        this.hideList();
      } else {
        this.showList();
      }
    }
  }

  public onEnterKey(): void {
    if (this.isEditable && this.dropDownVisible) {
      const selectedListIndex: number | null = this.getSelectedListIndex();
      if (selectedListIndex != null && selectedListIndex >= 0) {
        this.hideList();
        this.setSelectedIndex(selectedListIndex);
        this.callSelectionChanged();
      }
    }
  }

  protected onInput(chars: Array<string>): void {
    if (chars.length === 0 || !this.isEditable) {
      return;
    }

    let term: string = String.empty();

    for (const char of chars) {
      if (!char || char.length !== 1 || !this._regEx.test(char)) {
        break;
      }
      term += char;
    }

    if (term.trim().length > 0) {
      this.selectEntryOnTerm(term);
    }
  }

  public onEntryClicked(index: number): void {
    this.hideList();
    this.setSelectedIndex(index);
    this.callSelectionChanged();
  }

  protected selectEntryOnTerm(term: string): void {
    if (term.trim().length === 0) {
      return;
    }

    let currentTerm: string = String.empty();
    let latestIndex: number = -1;

    for (const char of term) {
      currentTerm += char;

      const indexForCurrentTerm: number = this.entries != null && this.entries.length > 0 ? this.entries.findIndexOnTerm(currentTerm) : -1;

      if (indexForCurrentTerm >= 0) {
        latestIndex = indexForCurrentTerm;
      }
    }

    if (latestIndex >= 0) {
      this.setSelectedIndex(latestIndex);
      if (!this.dropDownVisible) {
        this.callSelectionChanged();
      }
    }
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.tabIndexAttr = wrapper.getCurrentIsEditable() && wrapper.getTabStop() ? 0 : -1;
    const wrpValue: string | null = wrapper.getValue();
    this.setSelectedIndex(this.entries != null && this.entries.length > 0 && wrpValue != null ? this.entries.findIndexOnPk(wrpValue) : null);
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    super.updateStyles(wrapper);
    this.valueStyle = this.createValueStyle(wrapper);
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    return {
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColorTextInput(wrapper.getBackColor(), this.isEditable, this.isOutlined),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }
}
