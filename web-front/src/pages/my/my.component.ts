require('./my.styl');
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WdAjax, WdAlert } from './../../shared';

@Component({
  selector: 'my',
  templateUrl: 'my.component.html'
})

export class MyComponent implements OnInit {


  public projectList: Array<any> = [];
  public showSaveDialog: boolean = false;
  public currentProject: any = {};
  public tagItems: Array<string> = ['AngularJS', 'Vue1', 'Vue2', 'jQuery', 'CSS', 'HTML5', 'Animation', 'Canvas'];

  constructor(
    private router: Router,
    private ajax: WdAjax,
    private alert: WdAlert
  ) {

  }

  ngOnInit() {
    this._loadMyProject();
  }

  public navigate(item: any) {
    this.router.navigate([`/${item.username}/${item.projectId}`]);
  }

  public editProjectInfo(item: any) {
    this.currentProject = Object.assign({}, item);
    this.showSaveDialog = true;
  }

  public saveProjectInfo() {
    this.ajax.put(`${AppConf.apiHost}/project/${this.currentProject.projectId}`, {
      projectName: this.currentProject.projectName,
      projectDescription: this.currentProject.projectDescription,
      projectTags: this.currentProject.projectTags
    })
      .then(() => {
        this.showSaveDialog = false;
        this._loadMyProject();
      });
  }

  public deleteProject(item: any) {
    let layerId = this.alert.confirm('Sure to delete?', () => {
      this.ajax.delete(`${AppConf.apiHost}/project/${item.projectId}`)
        .then(() => {
          this._loadMyProject();
          this.alert.close(layerId);
        });
    });
  }

  private _loadMyProject() {
    this.ajax.get(`${AppConf.apiHost}/project/my?pageIndex=1&pageSize=20`)
      .then(({ data }) => {
        this.projectList = data.data;
      }).catch(() => {
        this.router.navigate(['/']);
      });
  }
}
