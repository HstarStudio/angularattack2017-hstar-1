import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType, Response } from '@angular/http';

@Injectable()
export class WdAjax {

  constructor(private http: Http) { }

  _request(type: string, url: string, data: any, options: any): Promise<any> {
    options = options || {};
    let requestOpt = new RequestOptions();
    requestOpt.method = type;
    requestOpt.responseType = ResponseContentType.Json;
    options.headers && (requestOpt.headers = new Headers(options.headers));
    options.params && (requestOpt.params = options.params);
    data && (requestOpt.body = data);
    requestOpt.withCredentials = options.withCredentials === true;
    return this.http.request(url, requestOpt).toPromise()
      .then(res => {
        return { res, requestOk: true };
      }).catch(res => {
        return { res, requestOk: false };
      }).then(({ res, requestOk }) => {
        let data = res.json();
        if (!requestOk || (data && data.isBizException)) {
          alert(data.message);
          return Promise.reject({ res, data });
        }
        return Promise.resolve({ res, data });
      });
  }

  get(url: string, options?: any) {
    return this._request('get', url, null, options);
  }

  delete(url: string, options?: any) {
    return this._request('delete', url, null, options);
  }

  post(url: string, data?: any, options?: any) {
    return this._request('post', url, data, options);
  }

  put(url: string, data?: any, options?: any) {
    return this._request('put', url, data, options);
  }
}
