export class TemplateContentWebComp extends HTMLElement {

  private tplDiv: HTMLDivElement;
  private tplSpans: Array<HTMLSpanElement> = new Array<HTMLSpanElement>();

  public init(templateCss: string, templateHtml: string): void {
    const template: HTMLTemplateElement = document.createElement('template');

    const css: string = `<style>:host { flex: 1; display: flex; flex-direction: column; } .tpl { flex: 1; box-sizing: border-box; }${!String.isNullOrWhiteSpace(templateCss) ? (' ' + templateCss) : String.empty()}</style>`;
    const html: string = `<div class="tpl">${!String.isNullOrWhiteSpace(templateHtml) ? (' ' + templateHtml) : String.empty()}</div>`;

    template.innerHTML = `${css} ${html}`;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.tplDiv = this.shadowRoot.querySelector('div.tpl');

    const spans: NodeListOf<HTMLSpanElement> = this.shadowRoot.querySelectorAll(`span[data-var]`);

    if (spans != null && spans.length > 0) {
      spans.forEach(span => this.tplSpans.push(span));
    }
  }

  public update(isEditable: boolean, values: Array<string>): void {
    if (this.tplDiv != null) {
      if (isEditable) {
        this.tplDiv.removeAttribute('tpldisabled');
      } else {
        this.tplDiv.setAttribute('tpldisabled', '');
      }
    }

    for (let i = 0; i < this.tplSpans.length; i++) {
      this.tplSpans[i].innerHTML = values[i];
    }
  }
}
