import { DataListEntry } from 'app/common/data-list-entry';

export class DataList extends Array<DataListEntry> {

  constructor() {
    super();
    Object.setPrototypeOf(this, DataList.prototype);
  }

  public findIndexOnPk(pk: string): number {
    return this.findIndex(entry => entry.getPk() === pk);
  }

  public findIndexOnValue(value: string): number {
    return this.findIndex(entry => entry.getValue() === value);
  }

  public findIndexOnTerm(term: string): number {
    if (term == null) {
      return -1;
    }

    const index: number = this.findIndex(entry => {
      const value: string = entry.getValue();
      if (String.isNullOrWhiteSpace(value) || value.length === 0) {
        return false;
      } else {
        const valueLower: string = value.toLowerCase();
        const termLower: string = term.toLowerCase();

        if (valueLower.startsWith(termLower)) {
          return true;
        }
      }
    });

    return index;
  }

  public getNullEntry(): DataListEntry {
    if (!this.length) { return null; }
    const firstEntry: DataListEntry = this[0];
    return firstEntry.isNullEntry() ? firstEntry : null;
  }

  public deserialize(json: Array<any>): void {
    if (!json || !json.length) {
      return;
    }

    json.forEach(entryJson => {
      this.push(new DataListEntry(entryJson.pk, entryJson.value));
    });
  }
}
