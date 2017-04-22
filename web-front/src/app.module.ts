import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent, ALL_PAGES } from './pages';
import { ALL_SERVICES } from './services';
import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    routing
  ],
  declarations: [...ALL_PAGES],
  providers: [Title, ...ALL_SERVICES],
  bootstrap: [AppComponent],
})
export class AppModule { }
