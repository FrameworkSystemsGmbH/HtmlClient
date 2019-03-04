import { TextFormat } from 'app/enums/text-format';
import { ListViewTemplateDataSourceWrapper } from 'app/wrappers/listview-template-datasource-wrapper';

export interface IListViewTemplateVariableWrapperOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class ListViewTemplateVariableWrapper {

  private dataSource: ListViewTemplateDataSourceWrapper;
  private format: TextFormat;
  private formatPattern: string;

  constructor(dataSource: ListViewTemplateDataSourceWrapper, options?: IListViewTemplateVariableWrapperOptions) {
    this.dataSource = dataSource;

    if (options && options.format) {
      this.format = options.format;
    }

    if (options && !String.isNullOrWhiteSpace(options.formatPattern)) {
      this.formatPattern = options.formatPattern;
    }
  }

  public getDataSource(): ListViewTemplateDataSourceWrapper {
    return this.dataSource;
  }

  public getFormat(): TextFormat {
    return this.format;
  }

  public getFormatPattern(): string {
    return this.formatPattern;
  }
}
