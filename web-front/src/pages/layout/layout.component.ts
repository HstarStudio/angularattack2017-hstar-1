require('./layout.styl');
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WdEventBus } from './../../shared';

@Component({
  templateUrl: 'layout.component.html'
})

export class LayoutComponent implements OnInit {
  constructor(
    private router: Router,
    private eventBus: WdEventBus
  ) {
  }

  ngOnInit() {

  }

  public saveProject() {
    this.eventBus.emit('project_save_click');
  }

  public navigate(path: string) {
    this.router.navigate([path]);
  }
}
