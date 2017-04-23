require('./login.styl');
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WdAjax, WdEventBus, WdAlert } from './../../shared';
import { AuthService } from './../../services';

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

  public loginUser = {
    username: '',
    password: ''
  };
  public registerUser = {
    username: '',
    password: '',
    password2: ''
  };
  public remember: boolean = false;

  constructor(
    private router: Router,
    private ajax: WdAjax,
    private alert: WdAlert,
    private eventBus: WdEventBus,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    let username = localStorage.getItem('username');
    if (username) {
      this.loginUser.username = username;
      this.remember = true;
    }
  }

  public doLogin() {
    this.ajax.post(`${AppConf.apiHost}/auth/login`, this.loginUser)
      .then(({ data }) => {
        this.auth.setUserInfo(data);
        this.eventBus.emit('user_login_succeed');
        if (this.remember) {
          localStorage.setItem('username', this.loginUser.username);
        } else {
          localStorage.removeItem('username');
        }
        this.router.navigate(['/']);
      });
  }

  public doRegister() {
    if (this.registerUser.password !== this.registerUser.password2) {
      return this.alert.msg('两次密码不一致');
    }
    this.ajax.post(`${AppConf.apiHost}/auth/register`, this.registerUser)
      .then(({ data }) => {
        this.auth.setUserInfo(data);
        this.eventBus.emit('user_login_succeed');
        this.router.navigate(['/']);
      });
  }
}
