import { DataSourceType } from '@app/enums/datasource-type';

export class TemplateControlTemplateDataSourceWrapper {

  private readonly name: string;
  private readonly dataSourceType: DataSourceType;

  public constructor(name: string, dataSourceType: DataSourceType) {
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
