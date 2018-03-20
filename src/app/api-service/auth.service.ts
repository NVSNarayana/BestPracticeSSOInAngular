import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import {
    StorageService, StorageKey, EventEmitterService, EventName,
    CacheKey, CacheService, HackService, RouterService
} from '../core';
import { AuthorizedCallbackModel, Template } from '../models';
import { OidcSecurityService } from '../sso';
import { UrlService } from './url.service';

@Injectable()
export class AuthService {
    constructor(private _urlSvc: UrlService,
        private _oidcSvc: OidcSecurityService,
        private _storageSvc: StorageService,
        private _evntSvc: EventEmitterService,
        private _cacheSvc: CacheService,
        private _hackSvc: HackService,
        private _routerSvc: RouterService) {
    }

    get isLoggedIn(): boolean {
        return <boolean>this._storageSvc.get(StorageKey.L_IsLogin);
    }

    get isAuthorized(): boolean {
        return this._oidcSvc.IsAuthorized();
    }

    login() {
        this._oidcSvc.Authorize();
    }

    logout() {
        this._storageSvc.remove(StorageKey.L_IsLogin);
        this._oidcSvc.Logoff();
    }

    handleHashCallback(): Observable<AuthorizedCallbackModel> {
        if (this._hackSvc.isIframeRequest()) {
            return this.handleIframeRequestHashCallback();
        }
        else {
            return this.handleNormalRequestHashCallback();
        }
    }

    refreshToken(): Observable<AuthorizedCallbackModel> {//background token refresh
        return this._oidcSvc.BackgroundAuthorizedCallbackObservable().flatMap((v: AuthorizedCallbackModel) => {
            if (v.isAuthResponseValid) {
                return Observable.of(v);
            }
            else {
                this.login();
                return Observable.empty();
            }
        });
    }

    getToken(): Observable<string> {
        return Observable.create(o => {
            if (this.isTokenRefreshing()) {//more than 1 http calls happened at a time
                console.log("TOKEN REFRESHING");
                this.tokenRefreshedObservable().subscribe(v => {
                    this.emitTokenObserver(o);
                });
            }
            else if (this._oidcSvc.NeedTokenRefresh()) {
                console.log("NEED TOKEN REFRESH ");
                this.emitRefreshTokenObserver(o);
            }
            else if (this.isAuthorized) {
                //console.log("ALREADY AUTHORIZED ");
                this.emitTokenObserver(o);
            }
            else {
                console.log("NOT AUTHORIZED");
                this.emitRefreshTokenObserver(o);
            }
        });
    }

    private handleNormalRequestHashCallback(): Observable<AuthorizedCallbackModel> {
        return Observable.create(o => {
            this._oidcSvc.AuthorizedCallbackObservable(window.location.hash).subscribe(v => {
                this._storageSvc.set(StorageKey.L_IsLogin, v.isAuthResponseValid);
                o.next(v);
                o.complete();
            });
        });
    }

    private handleIframeRequestHashCallback(): Observable<AuthorizedCallbackModel> {
        //iframe onload will takecare hash tokens. after this method iframe onload will call
        //todo based on requirement
        return Observable.empty();//observable that immediately completes
    }

    private emitRefreshTokenObserver(o: Observer<string>) {
        this._cacheSvc.set(CacheKey.IsTokenRefreshing, true);//token refresh start
        this.refreshToken().subscribe(v => {
            this._cacheSvc.remove(CacheKey.IsTokenRefreshing);//token refresh end
            if (v.isAuthResponseValid) {
                this.emitTokenObserver(o);
            }
        });
    }

    private emitTokenObserver(o: Observer<string>) {
        o.next(this._oidcSvc.GetToken());
        o.complete();
    }

    private isTokenRefreshing(): boolean {
        return this._cacheSvc.get<boolean>(CacheKey.IsTokenRefreshing);
    }

    private tokenRefreshedObservable(): Observable<any> {
        return Observable.create(o => {
            var sub = Observable.interval(300).subscribe(v => {
                console.log("interval: " + v);
                if (this._cacheSvc.get<boolean>(CacheKey.IsTokenRefreshing) == undefined) {
                    o.next(true);
                    o.complete();
                    sub.unsubscribe();
                }
            })
        })
    }
}