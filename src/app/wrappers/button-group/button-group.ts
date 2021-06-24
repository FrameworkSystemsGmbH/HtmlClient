import { BehaviorSubject, Observable } from 'rxjs';

export class ButtonGroup {

  private _groupName: string;

  private _value: string;
  private _orgValue: string;

  private _onValueChanged: BehaviorSubject<string>;
  private _onValueChanged$: Observable<string>;

  constructor(groupName: string) {
    this._groupName = groupName;

    this._onValueChanged = new BehaviorSubject<string>(null);
    this._onValueChanged$ = this._onValueChanged.asObservable();
  }

  public getGroupName(): string {
    return this._groupName;
  }

  public onValueChanged(): Observable<string> {
    return this._onValueChanged$;
  }

  public fireValueChanged(value: string): void {
    this._value = value;
    this._onValueChanged.next(this._value);
  }

  private hasChanges(): boolean {
    return this._value !== this._orgValue;
  }

  public getDataJson(): any {
    if (!this.hasChanges()) {
      return null;
    }

    const data: any = {
      text: this._value
    };

    return data;
  }

  public setDataJson(dataJson: any): void {
    if (!dataJson || !dataJson.text) {
      return;
    }

    this._value = dataJson.text.value;
    this._orgValue = this._value;

    this.fireValueChanged(this._value);
  }

}
