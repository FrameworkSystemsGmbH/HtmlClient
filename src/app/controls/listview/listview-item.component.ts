export class ListViewItemComponent {

  public static readonly htmlSelector: string = 'fs-listview-item';

  public static readonly contentPlaceholder: string = '{{ content }}';
  public static readonly containerHtml: string = `<div class="item-container">${ListViewItemComponent.contentPlaceholder}</div>`;
  public static readonly containerCss: string = `:host, ${ListViewItemComponent.htmlSelector}, .item-container { display: flex; flex-direction: column; } .item-container { overflow: hidden; }`;

  public static readonly hostMinWidthPlaceholder: string = '{{ min-width }}';
  public static readonly hostMinHeightPlaceholder: string = '{{ min-height }}';
  public static readonly hostMinSizeCss: string = `:host { min-width: ${ListViewItemComponent.hostMinWidthPlaceholder}; min-height: ${ListViewItemComponent.hostMinHeightPlaceholder}; }`;

  public id: string;
  public values: Array<string> = new Array<string>();

}
