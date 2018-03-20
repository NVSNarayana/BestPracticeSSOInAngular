import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable, Observer } from "rxjs/Rx";

import { HttpService, EventEmitterService, EventName, CacheService, CacheKey } from '../core';
import { EmployeeModel, StudentModel } from '../models';

import { UrlService } from './url.service';
import { AuthService } from './auth.service';

@Injectable()
export class TestService {
    constructor(private _urlSvc: UrlService,
        private _http: HttpService,
        private _evntSvc: EventEmitterService,
        private _cache: CacheService,
        private _authSvc: AuthService) {

    }

    getWithOutParams(): Observable<string> {
        return this._http.get(this._urlSvc.apiUrl + "/PublicIndications/myGet").map(v => v.text());
    }
    getWithParams(): Observable<string> {
        var p = { eno: 100, ename: "A", age: 44 };
        return this._http.get(this._urlSvc.apiUrl + "/PublicIndications/myGetWithParams", p, "88d0a15b8cd04672943f6fe584c091e5d3c958ef8888b9a3a0b614007850f979").map(v => v.text());
    }
    getWithEmployee(): Observable<EmployeeModel> {
        return this._http.get(this._urlSvc.apiUrl + "/PublicIndications/myGetEmployee", { eno: 100 }).map(v => v.json());
    }

    getStudents(): Observable<StudentModel> {
        return this._http.get(this._urlSvc.apiUrl("PublicIndications/myGetStudent")).map(v => v.json());
        //return Observable.create(o => this._apiCache.getCacheObserver(o, CacheKey.Student, this._url.apiUrl + "/PublicIndications/myGetStudent"))
    }

    postWithEmployee(): Observable<EmployeeModel> {
        return this._http.post(this._urlSvc.apiUrl("PublicIndications/myPostEmployee"), { Eno: 100, Ename: "A", Age: 40 }, null, "88d0a15b8cd04672943f6fe584c091e5d3c958ef8888b9a3a0b614007850f979").map(v => v.json());
    }

    isNonIfmCustomer(): Observable<boolean> {
        return this._authSvc.getToken().flatMap(token => {
            console.log(token);
            return this._http.get(this._urlSvc.apiUrl("Initialization/isNonIfmCustomer"), undefined, token).map(v => v.json())
        });
    }
}