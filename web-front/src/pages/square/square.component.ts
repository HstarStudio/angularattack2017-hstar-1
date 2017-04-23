require('./square.styl');
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { WdAjax } from './../../shared';

@Component({
  selector: 'square',
  templateUrl: 'square.component.html'
})

export class SquareComponent implements OnInit, OnDestroy {

  public projectList: Array<any> = [];
  private pageIndex: number = 1;
  private totalCount: number = 0;
  private pageSize: number = 20;
  private subs: Array<Subscription> = [];
  private mainContainer: HTMLElement;

  constructor(
    private router: Router,
    private ajax: WdAjax
  ) {

  }

  ngOnInit() {
    this._loadProjectList(this.pageIndex);
    this.mainContainer = document.querySelector('.main-container') as HTMLElement;
    this.mainContainer.style.overflowY = 'auto';
    let sub = Observable.fromEvent(this.mainContainer, 'scroll')
      .debounceTime(50)
      .subscribe(evt => {
        if ((this.mainContainer.clientHeight + this.mainContainer.scrollTop) >= this.mainContainer.scrollHeight - 50) {
          let pageCount = Math.ceil(this.totalCount / this.pageSize);
          if (this.pageIndex < pageCount) {
            this._loadProjectList(this.pageIndex++);
          }
        }

      });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.mainContainer.style.overflowY = 'hidden';
  }

  public navigate(item: any) {
    return this.router.navigate([`/${item.username}/${item.projectId}`]);
  }

  _loadProjectList(pageIndex: number) {
    this.ajax.get(`${AppConf.apiHost}/project?pageSize=${this.pageSize}&pageIndex=${pageIndex}`)
      .then(({ data }) => {
        this.totalCount = data.totalCount;
        this.projectList.push(...data.data);
      });
  }

}
