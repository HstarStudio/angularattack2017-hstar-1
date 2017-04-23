import { Injectable } from '@angular/core';

const templates = {
  angularjs: require('./templates/angularjs/index.ts').default,
  jquery: require('./templates/jquery/index.ts').default,
  normal: require('./templates/normal/index.ts').default,
  vue1: require('./templates/vue1/index.ts').default,
  vue2: require('./templates/vue2/index.ts').default
};

@Injectable()
export class TemplateService {

  constructor() { }

  getTemplate(name: string) {
    let t = templates[name] || { template: '', html: '', js: '', css: '' };
    t.name = name;
    return t;
  }
}
