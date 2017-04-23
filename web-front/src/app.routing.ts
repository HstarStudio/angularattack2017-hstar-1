import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  LayoutComponent, LoginComponent,
  HomeComponent, MyComponent, SquareComponent
} from './pages';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'my', component: MyComponent },
      { path: 'square', component: SquareComponent },
      { path: ':user/:project', component: HomeComponent }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
