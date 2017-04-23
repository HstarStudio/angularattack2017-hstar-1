require('./layout.styl');
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WdEventBus, WdTranslate } from './../../shared';
import { AuthService } from './../../services';

@Component({
  templateUrl: 'layout.component.html'
})

export class LayoutComponent implements OnInit {

  public username: string = '';
  public currentLang: string = '';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private eventBus: WdEventBus,
    private translate: WdTranslate,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    let self = this;
    this.username = this.auth.username;
    this.currentLang = this.translate.getCurrentLang();
  }

  public saveProject() {
    this.eventBus.emit('project_save_click');
  }

  public navigate(path: string) {
    this.router.navigate([path]);
  }

  public changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  public doLogout() {
    this.auth.logout()
      .then(() => {
        window.location.href = '';
      });
  }
}
