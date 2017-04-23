import { Injectable } from '@angular/core';
import { WdAjax } from './../shared';

@Injectable()
export class AuthService {

  private _userInfo: { username?: string, token?: string } = {};
  private _logged: boolean = false;

  constructor(
    private ajax: WdAjax
  ) { }

  public setUserInfo(userInfo: any) {
    this._userInfo = userInfo;
    this._logged = true;
    localStorage.setItem('x-dojo-token', userInfo.token);
    this.ajax.setCommonHeader('x-dojo-token', userInfo.token);
  }

  public get username() {
    return this._userInfo.username;
  }

  public get token() {
    return this._userInfo.token;
  }

  public get logged() {
    return this._logged;
  }

  public autoLogin(token: string) {
    return this.ajax.post(`${AppConf.apiHost}/auth/autologin`, null, {
      headers: {
        'x-dojo-token': token
      }
    })
      .then(({ data }) => {
        this.setUserInfo(data);
      })
      .catch(() => {
        return Promise.resolve(true);
      });
  }
}
