import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { SharedModule, SHARED_SERVICES, WdTranslate } from './shared';
import { AppComponent, ALL_PAGES } from './pages';
import { ALL_SERVICES } from './services';
import { routing } from './app.routing';
import langObj from './i18n';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule,
    routing
  ],
  declarations: [...ALL_PAGES],
  providers: [Title, SHARED_SERVICES, ...ALL_SERVICES],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private wdTranslate: WdTranslate) {
    this.wdTranslate.set(langObj);
    this.wdTranslate.use('en-us');
  }
}
