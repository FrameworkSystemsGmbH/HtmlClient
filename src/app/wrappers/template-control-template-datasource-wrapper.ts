import { DataSourceType } from '@app/enums/datasource-type';

export class TemplateControlTemplateDataSourceWrapper {

  private readonly _name: string;
  private readonly _dataSourceType: DataSourceType;

  public constructor(name: string, dataSourceType: DataSourceType) {
    this._name = name;
    this._dataSourceType = dataSourceType;
  }

  public getName(): string {
    return this._name;
  }

  public getDataSourceType(): DataSourceType {
    return this._dataSourceType;
  }
}
