import { Injectable } from '@angular/core';
import { StorageService, StorageType, StorageKey } from '../core';
import { AppLocalStoreModel, AppSessionStoreModel } from '../models';

@Injectable()
export class AppStorageService {

    constructor(private _storageSvc: StorageService) {

    }

    get localStore(): AppLocalStoreModel {
        var obj = this._storageSvc.get(StorageKey.L_CrushStore) as AppLocalStoreModel;
        return obj ? obj : new AppLocalStoreModel({});
    }

    get sessionStore(): AppSessionStoreModel {
        var obj = this._storageSvc.get(StorageKey.S_CrushStore, StorageType.Session) as AppSessionStoreModel;
        return obj ? obj : new AppSessionStoreModel({});
    }

    setLocalStoreItem(m: AppLocalStoreModel) {
        var str = JSON.stringify(m);//avoids undefined properties
        var obj = Object.assign({}, this.localStore, JSON.parse(str));
        this._storageSvc.set(StorageKey.L_CrushStore, obj);
    }

    setSessionStoreItem(m: AppSessionStoreModel) {
        var str = JSON.stringify(m);//avoids undefined properties
        var obj = Object.assign({}, this.sessionStore, JSON.parse(str));
        this._storageSvc.set(StorageKey.S_CrushStore, obj, StorageType.Session);
    }

    removeLocalStoreItem(m: AppLocalStoreModel) {//need to pass null values for removing properties
        var json = JSON.parse(JSON.stringify(m));//avoids undefined properties
        Object.keys(json).forEach(v => json[v] = undefined);//assign null to undefined;
        var obj = Object.assign({}, this.localStore, json);
        this._storageSvc.set(StorageKey.L_CrushStore, obj);
    }

    removeSessionStoreItem(m: AppSessionStoreModel) {//need to pass null values for removing properties
        var json = JSON.parse(JSON.stringify(m));//avoids undefined properties
        Object.keys(json).forEach(v => v = undefined);//assign null to undefined;
        var obj = Object.assign({}, this.sessionStore, json);
        this._storageSvc.set(StorageKey.S_CrushStore, obj);
    }

    removeLocalStore() {
        this._storageSvc.remove(StorageKey.L_CrushStore);
    }

    removeSessionStore() {
        this._storageSvc.remove(StorageKey.S_CrushStore, StorageType.Session);
    }
}