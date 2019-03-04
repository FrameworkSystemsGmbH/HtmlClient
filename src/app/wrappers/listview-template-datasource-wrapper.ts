import { DataSourceType } from 'app/enums/datasource-type';

export class ListViewTemplateDataSourceWrapper {

  private name: string;
  private dataSourceType: DataSourceType;

  constructor(name: string, dataSourceType: DataSourceType) {
    this.name = name;
    this.dataSourceType = dataSourceType;
  }

  public getName(): string {
    return this.name;
  }

  public getDataSourceType(): DataSourceType {
    return this.dataSourceType;
  }
}
