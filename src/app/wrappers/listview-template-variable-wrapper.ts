import { TextFormat } from 'app/enums/text-format';
import { DataSourceType } from 'app/enums/datasource-type';

export interface IListViewTemplateVariableOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class ListViewTemplateVariableWrapper {

  private index: number;
  private format: TextFormat;
  private formatPattern: string;
  private dataSourceType: DataSourceType;

  constructor(index: number, dataSourceType: DataSourceType, options?: IListViewTemplateVariableOptions) {
    this.index = index;
    this.dataSourceType = dataSourceType;

    if (options && options.format) {
      this.format = options.format;
    }

    if (options && !String.isNullOrWhiteSpace(options.formatPattern)) {
      this.formatPattern = options.formatPattern;
    }
  }

  public getIndex(): number {
    return this.index;
  }

  public getFormat(): TextFormat {
    return this.format;
  }

  public getFormatpattern(): string {
    return this.formatPattern;
  }

  public getDataSourceType(): DataSourceType {
    return this.dataSourceType;
  }
}
