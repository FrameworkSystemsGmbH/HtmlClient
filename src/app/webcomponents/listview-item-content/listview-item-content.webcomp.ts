export class ListViewItemContentWebComp extends HTMLElement {

  private templateContent: string;

  public init(globalCss: string, templateCss: string, templateHtml: string): void {
    const globCss: string = !String.isNullOrWhiteSpace(globalCss) ? ` ${globalCss}` : String.empty();
    const localCss: string = !String.isNullOrWhiteSpace(templateCss) ? ` ${templateCss}` : String.empty();

    const css: string = `<style>:host { flex: 1; display: flex; flex-direction: column; } .lvItem { flex: 1; box-sizing: border-box; }${globCss}${localCss}</style>`;
    const html: string = `<div class="lvItem">${!String.isNullOrWhiteSpace(templateHtml) ? ` ${templateHtml}` : String.empty()}</div>`;

    this.templateContent = `${css} ${html}`;

    this.attachShadow({ mode: 'open' });
  }

  public update(isEditable: boolean, values: Array<string>): void {
    let newContent: string = this.templateContent;

    if (values != null && values.length) {
      values.forEach((value, index) => {
        newContent = newContent.replaceAll(`{{${index}}}`, value != null ? value : String.empty());
      });
    }

    this.shadowRoot.innerHTML = newContent;

    const itemDiv: HTMLDivElement = this.shadowRoot.querySelector('div.lvItem');

    if (itemDiv != null) {
      if (isEditable) {
        itemDiv.removeAttribute('lvdisabled');
      } else {
        itemDiv.setAttribute('lvdisabled', '');
      }
    }
  }
}
