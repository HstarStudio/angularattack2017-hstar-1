require('./layout.styl');
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WdEventBus } from './../../shared';
import { AuthService } from './../../services';

@Component({
  templateUrl: 'layout.component.html'
})

export class LayoutComponent implements OnInit {

  public username: string = '';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private eventBus: WdEventBus,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    let self = this;
    this.username = this.auth.username;
  }

  public saveProject() {
    this.eventBus.emit('project_save_click');
  }

  public navigate(path: string) {
    this.router.navigate([path]);
  }

  public doLogout() {
    this.auth.logout()
      .then(() => {
        window.location.href = '';
      });
  }
}
