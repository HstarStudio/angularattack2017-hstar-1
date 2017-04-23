import { Injectable } from '@angular/core';

const noop = function () { };

@Injectable()
export class WdAlert {

  constructor() { }

  msg(message: string, callback?: Function) {
    return window['layer'].msg(message, {
      offset: 20,
      shift: 3,
      time: 1500
    }, callback || noop);
  }

  error(message: string, callback?: Function) {
    return window['layer'].msg(message, {
      offset: 20,
      shift: 3,
      time: 1500,
      icon: 2
    }, callback || noop);
  }

  confirm(message: string, okCallback?: Function, cancelCallback?: Function) {
    let layerId = window['layer'].confirm(message, {
      title: 'Confirm',
      btn: ['OK', 'Cancel'] //按钮
    }, function () {
      (okCallback || noop)();
    }, function () {
      (cancelCallback || noop)();
    });
    return layerId;
  }

  close(layerId: number) {
    window['layer'].close(layerId);
  }
}
