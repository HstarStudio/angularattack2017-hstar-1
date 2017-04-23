require('./my.styl');
import { Component, OnInit } from '@angular/core';
import { WdAjax } from './../../shared';

@Component({
  selector: 'my',
  templateUrl: 'my.component.html'
})

export class MyComponent implements OnInit {


  public projectList: Array<any> = [];

  constructor(
    private ajax: WdAjax
  ) {

  }

  ngOnInit() {
    this._loadMyProject();
  }

  private _loadMyProject() {
    this.ajax.get(`${AppConf.apiHost}/project/my?pageIndex=1&pageSize=20`)
      .then(({ data }) => {
        console.log(data);
      });
  }
}
