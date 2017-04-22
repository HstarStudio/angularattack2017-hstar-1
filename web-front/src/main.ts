require('@progress/kendo-theme-default/dist/all.css');
require('./styl/all.styl');

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
