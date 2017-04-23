import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable()
export class UtilService {

  constructor() { }

  /**
   * 初始化元素拖拽
   */
  initDrag(target: HTMLElement, fn: Function, options?: any): { destroy: Function } {
    let dragObj: any = {};
    let subArr: Array<Subscription> = [];
    let sub;
    // 鼠标按下时，标记拖拽开始
    sub = Observable.fromEvent(target, 'mousedown')
      .subscribe((e: MouseEvent) => {
        dragObj = {
          pageX: e.pageX,
          pageY: e.pageY,
          draging: true
        };
        if (typeof options.processDragObj === 'function') {
          options.processDragObj(dragObj);
        }
      });
    subArr.push(sub);
    // 鼠标移动时，开始执行拖拽
    sub = Observable.fromEvent(document, 'mousemove')
      .throttleTime(options.throttleTime || 20)
      .subscribe((e: MouseEvent) => {
        if (!dragObj.draging) {
          return;
        }
        fn(dragObj, e);
      });
    subArr.push(sub);
    // 鼠标松开时，停止拖拽
    sub = Observable.fromEvent(document, 'mouseup')
      .subscribe((e: MouseEvent) => {
        dragObj.draging = false;
      });
    subArr.push(sub);

    return {
      destroy() {
        subArr.forEach(sub => sub.unsubscribe());
      }
    }
  }

  getComputedStyle(el: HTMLElement, styleProperty: string) {
    return window.getComputedStyle(el)[styleProperty];
  }

  $(selector: string, doc: any) {
    return doc.querySelector(selector);
  }
}
