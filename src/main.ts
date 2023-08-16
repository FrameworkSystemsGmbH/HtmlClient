import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { APP_PROVIDERS } from '@app/app.providers';
import { ListViewItemContentWebComp } from '@app/webcomponents/listview-item-content/listview-item-content.webcomp';
import { TemplateControlContentWebComp } from '@app/webcomponents/template-control-content/template-control-content.webcomp';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

bootstrapApplication(AppComponent, { providers: APP_PROVIDERS }).catch(err => console.error(Error.ensureError(err)));

window.customElements.define('hc-listitem-content', ListViewItemContentWebComp);
window.customElements.define('hc-tpl-ctrl-content', TemplateControlContentWebComp);

void defineCustomElements(window);
