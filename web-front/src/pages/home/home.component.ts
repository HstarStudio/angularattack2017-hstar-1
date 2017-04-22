require('./home.styl');
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UtilService } from './../../services';

@Component({
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

  private dragEvents: Array<any> = [];
  private subs: Subscription[] = [];
  private editorValue: string = 'var i = 1;';
  private editorMode: string = 'javascript';
  private editorHeight: number = 100;

  constructor(
    private elementRef: ElementRef,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.initDragEvents();
    this._initSubscriptions();
    this._setEditorHeight();
  }

  ngOnDestroy() {
    this.dragEvents.forEach(item => item.destroy());
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  _initSubscriptions() {
    let sub = Observable.fromEvent(window, 'resize')
      .throttleTime(100)
      .subscribe(evt => {
        this._setEditorHeight();
      });
    this.subs.push(sub);
  }

  _setEditorHeight() {
    let height = this.util.getComputedStyle(document.querySelector('.note-list') as HTMLElement, 'height');
    this.editorHeight = parseInt(height, 10);
  }
  private initDragEvents() {
    let self = this;
    let leftSidebar = this.elementRef.nativeElement.querySelector('.left-sidebar');
    let rightViewport = this.elementRef.nativeElement.querySelector('.right-viewport');
    let drag = leftSidebar.querySelector('.drag-line');

    // 左侧面板拖拽
    let dragEvent = this.util.initDrag(drag, (dragObj: any, e: MouseEvent) => {
      let moveX = e.pageX - dragObj.pageX;
      let width = dragObj.initialLeft + moveX;
      width = Math.max(160, Math.min(240, width)); // 小于等于720，大于等于200
      leftSidebar.style.width = `${width}px`;
      rightViewport.style.left = `${width}px`;
    }, {
        processDragObj(dragObj: any) {
          dragObj.initialLeft = parseInt(leftSidebar.style.width || '200', 10);
        }
      }
    );
    this.dragEvents.push(dragEvent);

    let drag2 = rightViewport.querySelector('.note-list .drag-line');
    let noteList = rightViewport.querySelector('.note-list');
    let noteView = rightViewport.querySelector('.note-view');
    // 中间面板拖拽
    dragEvent = this.util.initDrag(drag2, (dragObj: any, e: MouseEvent) => {
      let moveX = e.pageX - dragObj.pageX;
      let width = dragObj.initialLeft + moveX;
      let maxValue = window.innerWidth - parseInt(this.util.getComputedStyle(leftSidebar, 'width'), 10) - 320;
      width = Math.max(280, Math.min(maxValue, width)); // 小于等于720，大于等于280
      noteList.style.width = `${width}px`;
      noteView.style.left = `${width}px`;
    }, {
        processDragObj(dragObj: any) {
          let clientWidth = parseInt(self.util.getComputedStyle(noteList, 'width'), 10);
          dragObj.initialLeft = parseInt(noteList.style.width || clientWidth.toString(), 10);
        }
      }
    );
    this.dragEvents.push(dragEvent);
  }
}
