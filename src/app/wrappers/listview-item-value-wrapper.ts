import { DataSourceType } from 'app/enums/datasource-type';

export class ListViewItemValue {

  private dataSourceType: DataSourceType;
  private value: any;

  constructor(dataSourceType: DataSourceType, value: any) {
    this.dataSourceType = dataSourceType;
    this.value = value;
  }

  public getDataSourceType(): DataSourceType {
    return this.dataSourceType;
  }

  public getValue(): any {
    return this.value;
  }
}
