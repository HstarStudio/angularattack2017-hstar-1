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
      { path: '', component: SquareComponent },
      { path: 'new', component: HomeComponent },
      { path: ':user/:project', component: HomeComponent },
      { path: 'my', component: MyComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
