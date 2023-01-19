import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { ListViewItemContentWebComp } from '@app/webcomponents/listview-item-content/listview-item-content.webcomp';
import { TemplateControlContentWebComp } from '@app/webcomponents/template-control-content/template-control-content.webcomp';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.log(error));

window.customElements.define('hc-listitem-content', ListViewItemContentWebComp);
window.customElements.define('hc-tpl-ctrl-content', TemplateControlContentWebComp);

void defineCustomElements(window);
