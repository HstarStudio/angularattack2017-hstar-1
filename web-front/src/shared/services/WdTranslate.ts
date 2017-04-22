import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class WdTranslate {

  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang('en-us');
  }

  use(lang: string) {
    this.translateService.use(lang);
  }

  set(langObj: any) {
    Object.keys(langObj).forEach(lang => {
      let obj = langObj[lang];
      this.translateService.setTranslation(lang, obj, true);
    });
  }

  get(key: string | string[]) {
    return this.translateService.instant(key);
  }

  getCurrentLang() {
    return this.translateService.currentLang;
  }
}
