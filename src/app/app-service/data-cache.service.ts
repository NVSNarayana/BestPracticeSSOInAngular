import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { StorageService, StorageType, StorageKey, CacheService, CacheKey } from '../core';
import { AppLocalStoreModel, AppSessionStoreModel, EmployeeModel, StudentModel } from '../models';
import { TestService } from '../api-service';

@Injectable()
export class DataCacheService {

    constructor(private _cacheSvc: CacheService, private _testSvc: TestService) {
        this._testSvc.getWithEmployee()

    }

    employees(): Observable<EmployeeModel> {
        return Observable.create(o => this.getCacheObserver(o, CacheKey.Employee, this._testSvc.getWithEmployee()));
    }

    students(): Observable<StudentModel> {
        return Observable.create(o => this.getCacheObserver(o, CacheKey.Student, this._testSvc.getStudents()));
    }

    private getCacheObserver<T>(o: Observer<T>, cacheKey: CacheKey, ob: Observable<T>) {
        if (this._cacheSvc.contains(cacheKey)) {
            o.next(this._cacheSvc.get(cacheKey));
        }
        else {
            ob.subscribe((v: T) => {
                this._cacheSvc.set(cacheKey, v);
                o.next(v);
            })
        }
    }
}