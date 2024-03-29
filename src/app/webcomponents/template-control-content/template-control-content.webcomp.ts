export class TemplateControlContentWebComp extends HTMLElement {

  private _templateContent: string = String.empty();

  public init(globalCss: string | null, templateCss: string | null, templateHtml: string | null): void {
    const globCss: string = globalCss != null && globalCss.trim().length > 0 ? ` ${globalCss}` : String.empty();
    const localCss: string = templateCss != null && templateCss.trim().length > 0 ? ` ${templateCss}` : String.empty();

    const css: string = `<style>:host { flex: 1; display: flex; flex-direction: column; } .tpl { flex: 1; box-sizing: border-box; }${globCss}${localCss}</style>`;
    const html: string = `<div class="tpl">${templateHtml != null && templateHtml.trim().length > 0 ? ` ${templateHtml}` : String.empty()}</div>`;

    this._templateContent = `${css} ${html}`;

    this.attachShadow({ mode: 'open' });
  }

  public update(isEditable: boolean, values: Array<string | null>): void {
    if (this.shadowRoot == null) {
      return;
    }

    let newContent: string = this._templateContent;

    if (values.length > 0) {
      values.forEach((value, index) => {
        newContent = newContent.replaceAll(`{{${index}}}`, value ?? String.empty());
      });
    }

    this.shadowRoot.innerHTML = newContent;

    const tplDiv: HTMLDivElement | null = this.shadowRoot.querySelector('div.tpl');

    if (tplDiv != null) {
      if (isEditable) {
        tplDiv.removeAttribute('tpldisabled');
      } else {
        tplDiv.setAttribute('tpldisabled', String.empty());
      }
    }
  }
}
