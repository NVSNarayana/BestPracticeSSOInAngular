import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { EventEmitterService, EventName } from './event-emitter.service';

@Injectable()
export class HttpService {
  private authHeader: string = "Authorization";
  private tokenType: string = "Bearer ";
  constructor(private _http: Http, private _evntSvc: EventEmitterService) { }

  get(url: string, params?: any, token?: string): Observable<Response> {
    return this._http.get(url, this.prepareRequestOptions(params, token)).catch((error, c) => {
      console.log(url);
      console.log(params);
      this._evntSvc.emitter(EventName.HttpError).emit(error);
      return Observable.throw(error);
    });
  }

  post(url: string, body: any, params?: any, token?: string): Observable<Response> {
    return this._http.post(url, body, this.prepareRequestOptions(params, token)).catch((error, c) => {
      console.log(url);
      console.log(body);
      this._evntSvc.emitter(EventName.HttpError).emit(error);
      return Observable.throw(error);
    });
  }

  private prepareRequestOptions(params?: any, token?: string): RequestOptions {
    var ro = new RequestOptions();

    if (params) {
      ro.params = params;
    }

    if (token) {
      var ob = {};
      ob[this.authHeader] = this.tokenType + token;
      ro.headers = new Headers(ob);
    }

    return ro;
  }
}
