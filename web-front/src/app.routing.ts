import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent, LoginComponent } from './pages';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
