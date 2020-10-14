export class TemplateContentWebComp extends HTMLElement {

  private templateContent: string;

  public init(globalCss: string, templateCss: string, templateHtml: string): void {
    const globCss: string = !String.isNullOrWhiteSpace(globalCss) ? ` ${globalCss}` : String.empty();
    const localCss: string = !String.isNullOrWhiteSpace(templateCss) ? ` ${templateCss}` : String.empty();

    const css: string = `<style>:host { flex: 1; display: flex; flex-direction: column; } .tpl { flex: 1; box-sizing: border-box; }${globCss}${localCss}</style>`;
    const html: string = `<div class="tpl">${!String.isNullOrWhiteSpace(templateHtml) ? ` ${templateHtml}` : String.empty()}</div>`;

    this.templateContent = `${css} ${html}`;

    this.attachShadow({ mode: 'open' });
  }

  public update(isEditable: boolean, values: Array<string>): void {
    let newContent: string = this.templateContent;

    if (values != null && values.length) {
      values.forEach((value, index) => {
        newContent = newContent.replaceAll(`{{${index}}}`, value);
      });
    }

    this.shadowRoot.innerHTML = newContent;

    const tplDiv: HTMLDivElement = this.shadowRoot.querySelector('div.tpl');

    if (tplDiv != null) {
      if (isEditable) {
        tplDiv.removeAttribute('tpldisabled');
      } else {
        tplDiv.setAttribute('tpldisabled', '');
      }
    }
  }
}
