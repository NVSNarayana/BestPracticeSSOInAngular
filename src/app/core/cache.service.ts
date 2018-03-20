import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class CacheService {
    private cacheSub: Subject<any> = new Subject();
    private cacheObject: {};

    constructor() {
        this.getCacheObservable().subscribe(v => {
            this.cacheObject = v;
        })
    }

    private getCacheObservable(): Observable<any> {
        return this.cacheSub.scan((acc, curr) => Object.assign({}, acc, curr), {});
    }

    set(key: CacheKey, value: any) {
        var obj = {};
        obj[key] = JSON.parse(JSON.stringify(value));
        this.cacheSub.next(obj);
    }

    get<T>(key: CacheKey) {
        if (this.cacheObject && this.cacheObject.hasOwnProperty(key)) {
            return this.cacheObject[key] as T;
        }
        return undefined;
    }

    remove(key: CacheKey) {
        if (this.contains(key)) {
            delete this.cacheObject[key];//removes from observable memory
        }
    }

    contains(key: CacheKey): boolean {
        if (this.cacheObject && this.cacheObject.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }
}

export enum CacheKey {
    Student, Employee, Customer, IsTokenRefreshing
}