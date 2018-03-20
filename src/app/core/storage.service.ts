import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    private _sessionStorage: any;
    private _localStorage: any;

    constructor() {
        //try-catch required when cookies disabled
        try {
            this._sessionStorage = sessionStorage;
            this._localStorage = localStorage;
        } catch (e) {
            console.log("No storage found because cookies are disabled or private browsing.");
        }
    }

    get(key: StorageKey, type: StorageType = StorageType.Local): any {
        if (type == StorageType.Local) {
            return this.getLocalStorageItem(key);
        } else {
            return this.getSessionStorageItem(key);
        }
    }

    set(key: StorageKey, value: any, type: StorageType = StorageType.Local) {
        if (type == StorageType.Local) {
            return this.setLocalStorageItem(key, value);
        } else {
            return this.setSessionStorageItem(key, value);
        }
    }

    remove(key: StorageKey, type: StorageType = StorageType.Local) {
        if (type == StorageType.Local) {
            return this.removeLocalStorageItem(key);
        } else {
            return this.removeSessionStorageItem(key);
        }
    }

    contains(key: StorageKey, type: StorageType = StorageType.Local): boolean {
        if (type == StorageType.Local) {
            return this.getLocalStorageItem(key) != undefined;
        } else {
            return this.getSessionStorageItem(key) != undefined;
        }
    }

    //#region Local Storage 
    private getLocalStorageItem(key: string): any {
        let item = this._localStorage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }
        return undefined;
    }

    private setLocalStorageItem(key: string, value: any) {
        this._localStorage.setItem(key, JSON.stringify(value));
    }

    private removeLocalStorageItem(key: string) {
        this._localStorage.removeItem(key);
    }
    //#endregion

    //#region Session Storage 
    private getSessionStorageItem(key: string): any {
        let item = this._sessionStorage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }
        return undefined;
    }

    private setSessionStorageItem(key: string, value: any) {
        this._sessionStorage.setItem(key, JSON.stringify(value));
    }

    private removeSessionStorageItem(key: string) {
        this._sessionStorage.removeItem(key);
    }
    //#endregion
}

export enum StorageType {
    Local, Session
}

export enum StorageKey {
    //localStorage
    L_IsLogin = "IsLogin",
    L_CrushStore = "CrushLocalStore",
 

    //sessionStorage
    S_CrushStore = "CrushSessionStore",
    S_AuthorizationData="authorizationData",
    S_AuthorizationDataIdToken="authorizationDataIdToken",
    S_IsAuthorized="_isAuthorized",
    S_AuthStateControl="authStateControl",
    S_AuthNonce="authNonce"

}