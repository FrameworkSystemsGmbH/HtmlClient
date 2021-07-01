import { TextFormat } from '@app/enums/text-format';
import { ListViewTemplateDataSourceWrapper } from '@app/wrappers/listview-template-datasource-wrapper';

export interface IListViewTemplateVariableWrapperOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class ListViewTemplateVariableWrapper {

  private readonly _dataSource: ListViewTemplateDataSourceWrapper;
  private readonly _format: TextFormat = TextFormat.None;
  private readonly _formatPattern: string | null = null;

  public constructor(dataSource: ListViewTemplateDataSourceWrapper, options?: IListViewTemplateVariableWrapperOptions) {
    this._dataSource = dataSource;

    if (options && options.format) {
      this._format = options.format;
    }

    if (options && options.formatPattern && options.formatPattern.trim().length) {
      this._formatPattern = options.formatPattern;
    }
  }

  public getDataSource(): ListViewTemplateDataSourceWrapper {
    return this._dataSource;
  }

  public getFormat(): TextFormat {
    return this._format;
  }

  public getFormatPattern(): string | null {
    return this._formatPattern;
  }
}
