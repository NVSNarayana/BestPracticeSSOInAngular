import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { OtcConfigModel } from '../models';

@Injectable()
export class ConfigurationService {
    private _configurationObservable: Observable<OtcConfigModel>;

    constructor(private _http: Http) {
        this._configurationObservable = this._http.get("assets/otc.config.json")
            .map(r => <OtcConfigModel>r.json())
            .publishReplay(1)
            .refCount();
    }

    get ConfigurationObservable() {
        return this._configurationObservable;
    }
}