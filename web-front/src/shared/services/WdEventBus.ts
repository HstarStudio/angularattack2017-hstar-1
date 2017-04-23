import { Injectable, Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

const eventMap = new Map<string, Subject<any>>();

@Injectable()
export class WdEventBus {

  constructor() { }

  on(eventName: string, eventHandler: Function, component?: any) {
    if (!eventMap.has(eventName)) {
      let subject: Subject<any> = new Subject();
      eventMap.set(eventName, subject);
    }
    let subject = eventMap.get(eventName);
    let sub: Subscription = subject.subscribe(event => {
      eventHandler(event);
    });
    if (component) { // If pass component, so can auto unsubscribe.
      let originalDestroy: Function = null;
      if (component.ngOnDestroy) {
        originalDestroy = component.ngOnDestroy.bind(component);
      }
      component.ngOnDestroy = () => {
        sub.unsubscribe();
        originalDestroy && originalDestroy();
      };
    }
    return sub;
  }

  once(eventName: string, eventHandler: Function, component?: any) {
    let sub = this.on(eventName, (evt: any) => {
      if (typeof eventHandler === 'function') {
        eventHandler.call(null, evt);
      }
      sub.unsubscribe();
    }, component);
    return sub;
  }

  emit(eventName: string, data?: any) {
    if (!eventMap.has(eventName)) {
      return false;
    }
    let subject = eventMap.get(eventName);
    subject.next(data);
    return true;
  }
}
