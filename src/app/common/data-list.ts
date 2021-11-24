import { DataListEntry } from '@app/common/data-list-entry';

export class DataList extends Array<DataListEntry> {

  public constructor() {
    super();
    Object.setPrototypeOf(this, DataList.prototype);
  }

  public static getFromJson(json: Array<any> | null): DataList | null {
    if (!json || !json.length) {
      return null;
    }

    const dataList: DataList = new DataList();

    for (let i = 0; i < json.length; i++) {
      const entry = json[i];

      if (i === 0 && entry.pk === String.empty()) {
        dataList.push(new DataListEntry(entry.pk, entry.value, true));
      } else {
        dataList.push(new DataListEntry(entry.pk, entry.value, false));
      }
    }

    return dataList;
  }

  public getJson(): any {
    return this.map(entry => entry.getJson());
  }

  public findIndexOnPk(pk: string | null): number {
    return this.entries.length > 0 ? this.findIndex(entry => entry.getPk() === pk) : -1;
  }

  public findIndexOnValue(value: string | null): number {
    return this.entries.length > 0 ? this.findIndex(entry => entry.getValue() === value) : -1;
  }

  public findIndexOnTerm(term: string | null): number {
    if (term == null || this.entries.length === 0) {
      return -1;
    }

    const index: number = this.findIndex(entry => {
      const value: string | null = entry.getValue();

      if (value == null || value.trim().length === 0) {
        return false;
      }

      const valueLower: string = value.toLowerCase();
      const termLower: string = term.toLowerCase();

      return valueLower.startsWith(termLower);
    });

    return index;
  }
}
