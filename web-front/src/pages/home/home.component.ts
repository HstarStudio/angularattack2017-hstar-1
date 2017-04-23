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
  private previewContainer: any = null;
  private leftSidebarWidth: number = 0;

  public isLeftSidebarMini: boolean = false;
  public editorValue: string = 'var i = 1;';
  public editorMode: string = 'javascript';
  public editorHeight: number = 100;
  public previewLoading: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.previewContainer = this.util.$('.preview-container', this.elementRef.nativeElement);
    this._initDragEvents();
    this._initSubscriptions();
    this._setEditorHeight();
  }

  ngOnDestroy() {
    this.dragEvents.forEach(item => item.destroy());
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public menuMiniBtnClick() {
    let leftSidebar = this.util.$('.left-sidebar', this.elementRef.nativeElement);
    let rightViewport = this.util.$('.right-viewport', this.elementRef.nativeElement);
    if (this.isLeftSidebarMini) { // Need expand
      leftSidebar.style.width = `${this.leftSidebarWidth}px`;
      rightViewport.style.left = `${this.leftSidebarWidth}px`;
      this.isLeftSidebarMini = false;
    } else { // Need collspse
      this.leftSidebarWidth = parseInt(this.util.getComputedStyle(leftSidebar, 'width'), 10);
      leftSidebar.style.width = '0px';
      rightViewport.style.left = '0px';
      this.isLeftSidebarMini = true;
    }
  }

  public runCode() {
    this.previewLoading = true;
    let startLoadingTime = Date.now();
    let iframeHtml = `<iframe id="previewFrame" frameborder="0" style="width: 100%;height: 100%;" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>`;
    this.previewContainer.innerHTML = iframeHtml;
    let iframe = document.getElementById('previewFrame') as any;
    let fd = iframe.contentDocument;
    Observable.fromEvent(iframe, 'load')
      .subscribe(evt => {
        let timespan = Date.now() - startLoadingTime;
        setTimeout(() => {
          this.previewLoading = false;
        }, timespan > 1000 ? 0 : 1000 - timespan);
      });
    fd.open();
    fd.write('');
    fd.write(this._buildHtmlCodeForPreview());
    fd.close();
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

  _buildHtmlCodeForPreview() {
    let html = this.editorValue;
    html = html.replace(/<head>/, `<head><script src="/static/vendor/console.mock.js"></script>`)
      .replace(/<\/head>/, `<style>${''}</style></head>`);
    html = html.replace(/<\/body>/, `<script>${this.editorValue}</script></body>`);
    return html;
  }

  private _initDragEvents() {
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
    let noteView = rightViewport.querySelector('.preview-container');
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
