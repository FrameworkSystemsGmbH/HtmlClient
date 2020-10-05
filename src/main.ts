import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AppModule } from '@app/app.module';
import { environment } from '@env/env.dev';

import { TemplateContentWebComp } from '@app/webcomponents/template-content/template-content.webcomp';
import { ListViewItemContentWebComp } from '@app/webcomponents/listview-item-content/listview-item-content.webcomp';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.log(error));

window.customElements.define('hc-tpl-ctrl-content', TemplateContentWebComp);
window.customElements.define('hc-listitem-content', ListViewItemContentWebComp);

defineCustomElements(window);
