import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { toErrorWithMessage } from './app/shared/util/errors';

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => { console.error(err); throw toErrorWithMessage(err); } );
