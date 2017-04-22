require('../../../src/styl/all.styl');

import { enableProdMode } from '@angular/core';
import { platformBrowser, } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/src/app.module.ngfactory';

console.log('Running AOT compiled');
enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
