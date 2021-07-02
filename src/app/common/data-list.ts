import { DataListEntry } from '@app/common/data-list-entry';

export class DataList extends Array<DataListEntry> {

  public constructor() {
    super();
    Object.setPrototypeOf(this, DataList.prototype);
  }

  public findIndexOnPk(pk: string | null): number {
    return this.findIndex(entry => entry.getPk() === pk);
  }

  public findIndexOnValue(value: string | null): number {
    return this.findIndex(entry => entry.getValue() === value);
  }

  public findIndexOnTerm(term: string | null): number {
    if (term == null) {
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

  public getNullEntry(): DataListEntry | null {
    if (!this.length) {
      return null;
    }

    const firstEntry: DataListEntry = this[0];

    return firstEntry.isNullEntry() ? firstEntry : null;
  }

  public deserialize(json: Array<any> | null): void {
    if (!json || !json.length) {
      return;
    }

    json.forEach(entryJson => {
      this.push(new DataListEntry(entryJson.pk, entryJson.value));
    });
  }
}
