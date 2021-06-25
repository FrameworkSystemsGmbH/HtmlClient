import { TextFormat } from '@app/enums/text-format';
import { TemplateControlTemplateDataSourceWrapper } from '@app/wrappers/template-control-template-datasource-wrapper';

export interface ITemplateControlTemplateVariableWrapperOptions {
  format?: TextFormat;
  formatPattern?: string;
}

export class TemplateControlTemplateVariableWrapper {

  private dataSource: TemplateControlTemplateDataSourceWrapper;
  private format: TextFormat;
  private formatPattern: string;

  public constructor(dataSource: TemplateControlTemplateDataSourceWrapper, options?: ITemplateControlTemplateVariableWrapperOptions) {
    this.dataSource = dataSource;

    if (options && options.format) {
      this.format = options.format;
    }

    if (options && !String.isNullOrWhiteSpace(options.formatPattern)) {
      this.formatPattern = options.formatPattern;
    }
  }

  public getDataSource(): TemplateControlTemplateDataSourceWrapper {
    return this.dataSource;
  }

  public getFormat(): TextFormat {
    return this.format;
  }

  public getFormatPattern(): string {
    return this.formatPattern;
  }
}
