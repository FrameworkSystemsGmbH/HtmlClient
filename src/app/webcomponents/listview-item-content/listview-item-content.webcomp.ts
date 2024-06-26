/**
 * WebComponent, welche eigenes HTML enthält. Die werden vom Browser aufgerufen
 * nicht von Angular. Die machen sich ein ShadowDOM auf. Und so Hat jedes Item sein HTML,
 * dadurch das jedes
 * HTML seinen ShadowDOM hat, so funktioniert auch das ContextMenü im Monaco.
 * Diese werden in der main.ts registriert.!
 * Init und Update sind WebComponentHooks
 *
 */
export class ListViewItemContentWebComp extends HTMLElement {

  private _templateContent: string = String.empty();

  public init(globalCss: string | null, templateCss: string | null, templateHtml: string | null): void {
    const globCss: string = globalCss != null && globalCss.trim().length > 0 ? ` ${globalCss}` : String.empty();
    const localCss: string = templateCss != null && templateCss.trim().length > 0 ? ` ${templateCss}` : String.empty();

    const css: string = `<style>:host { flex: 1; display: flex; flex-direction: column; } .lvItem { flex: 1; box-sizing: border-box; }${globCss}${localCss}</style>`;
    const html: string = `<div class="lvItem">${templateHtml != null && templateHtml.trim().length > 0 ? ` ${templateHtml}` : String.empty()}</div>`;

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

    const itemDiv: HTMLDivElement | null = this.shadowRoot.querySelector('div.lvItem');

    if (itemDiv != null) {
      if (isEditable) {
        itemDiv.removeAttribute('lvdisabled');
      } else {
        itemDiv.setAttribute('lvdisabled', String.empty());
      }
    }
  }
}
