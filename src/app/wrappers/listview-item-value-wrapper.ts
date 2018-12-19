import { DataSourceType } from 'app/enums/datasource-type';

export class ListViewItemValue {

  private index: number;
  private dataSourceType: DataSourceType;
  private value: any;

  constructor(index: number, dataSourceType: DataSourceType, value: any) {
    this.index = index;
    this.dataSourceType = dataSourceType;
    this.value = value;
  }

  public getIndex(): number {
    return this.index;
  }

  public getDataSourceType(): DataSourceType {
    return this.dataSourceType;
  }

  public getValue(): any {
    return this.value;
  }
}
