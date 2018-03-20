import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd, Params, NavigationExtras } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx'

@Injectable()
export class RouterService {

    private _routeParamsSubject: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
    private _queryStringParamsSubject: BehaviorSubject<Params> = new BehaviorSubject<Params>({});

    constructor(private _router: Router,
        private _activatedRoute: ActivatedRoute) {
        this.subscribeEvents();
    }

    get locationPathName() {
        return window.location.pathname;
    }

    getRouteParams(): Observable<Params> {
        return Observable.create(o => {
            this._routeParamsSubject.subscribe((v: Params) => {
                o.next(v);
                o.complete();
            });
        });
    }

    getQueryParams(): Observable<Params> {
        return Observable.create(o => {
            this._queryStringParamsSubject.subscribe((v: Params) => {
                o.next(v);
                o.complete();
            });
        });
    }

    getNavigateParams(path: string): NavigateParams {
        if (!path) return new NavigateParams(["/"]);//if path is null or undefined
        if (path.indexOf('?') > -1) {
            return this.getNavigateQueryCommands(path);//home?id=40&name=abc
        }
        else {
            return this.getNavigateRouteCommands(path);//home/40
        }
    }

    getRouteParam<T>(key: string): Observable<T> {
        return Observable.create(o => {
            this.getRouteParams().subscribe((v: Params) => {
                if (v && v.hasOwnProperty(key)) {
                    o.next(v[key]);
                    o.complete();
                }
                return Observable.empty();
            });
        });
    }

    getQueryParam<T>(key: string): Observable<T> {
        return Observable.create(o => {
            this.getQueryParams().subscribe((v: Params) => {
                if (v && v.hasOwnProperty(key)) {
                    o.next(v[key]);
                    o.complete();
                }
                return Observable.empty();
            });
        });
    }

    private subscribeEvents() {
        this._router.events.subscribe((navState) => {
            if (navState instanceof NavigationEnd) {
                this._routeParamsSubject.next(this._activatedRoute.snapshot.firstChild.params);
                this._queryStringParamsSubject.next(this._activatedRoute.snapshot.queryParams);
            }
        });
    }

    private getNavigateRouteCommands(path: string): NavigateParams {
        var returnVal = [];
        var arr = path.split('/');
        arr.splice(0, 1);
        arr.forEach((v, i) => {
            if (i == 0) {
                returnVal.push("/" + v)
            }
            else {
                returnVal.push(v);
            }
        });
        return new NavigateParams(returnVal);
    }

    private getNavigateQueryCommands(path: string): NavigateParams {
        var returnVal = new NavigateParams([]);
        var arr = path.split('?');
        if (arr) {
            returnVal.commands = [arr[0]];
            returnVal.extras = { queryParams: this.queryStringToJSON(arr[1]) };
        }
        return returnVal;
    }

    private queryStringToJSON(str): {} {
        var pairs = str.split('&');
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            var name = pair[0]
            var value = pair[1]
            if (name.length)
                if (result[name] !== undefined) {
                    if (!result[name].push) {
                        result[name] = [result[name]];
                    }
                    result[name].push(value || '');
                } else {
                    result[name] = value || '';
                }
        });
        return result;
    }
}

export class NavigateParams {
    constructor(cmds: any[], extras?: NavigationExtras) {
        this.commands = cmds;
        this.extras = extras;
    }
    commands: any[];
    extras?: NavigationExtras
}