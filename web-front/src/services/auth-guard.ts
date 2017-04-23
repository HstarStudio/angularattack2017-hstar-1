import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  private autoLoginUsed = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, isChild = false): Promise<boolean> {
    if (this.autoLoginUsed) {
      return Promise.resolve(true);
    }
    let token = localStorage.getItem('x-dojo-token');
    if (!token) {
      this.autoLoginUsed = true;
      return Promise.resolve(true);
    } else {
      return this.auth.autoLogin(token)
        .then(() => true);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state, true);
  }
}
