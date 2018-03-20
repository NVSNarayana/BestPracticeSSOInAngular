import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable, Subscriber, Observer } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityValidation } from './oidc.security.validation';
import { JwtKeys } from './jwtkeys';
import { ConfigurationService } from "./configuration.service";
import { LoggingService, StorageKey, StorageService, StorageType } from "../core";
import { Constants, AuthorizedCallbackModel } from '../models';

@Injectable()
export class OidcSecurityService {
    private _isAuthorized: boolean = false;
    private _configuration: AuthConfiguration;
    private oidcSecurityValidation: OidcSecurityValidation;

    private errorMessage: string;
    private jwtKeys: JwtKeys;

    constructor(private _http: Http,
        private _router: Router,
        private _logger: LoggingService,
        private _configSvc: ConfigurationService,
        private _storageSvc: StorageService
    ) {
        this.oidcSecurityValidation = new OidcSecurityValidation();

        if (this.retrieve(StorageKey.S_IsAuthorized)) {//to avoid undefined assignment
            this._isAuthorized = this.retrieve(StorageKey.S_IsAuthorized);
        }
        this.setConfiguration().subscribe(v => { });
    }

    GetToken(): any {
        return this.retrieve(StorageKey.S_AuthorizationData);
    }

    IsAuthorized(): boolean {
        var returnVal = false;
        this._logger.debug("OidcSecurityService: IsAuthorized() start");
        if (this._isAuthorized) {
            if (this.IsTokenExpired()) {
                this._logger.debug('IsAuthorized: isTokenExpired');
                this.ResetAuthorizationData();
                returnVal = false;
            } else {
                returnVal = true;
            }
        }
        this._logger.debug("OidcSecurityService: IsAuthorized() end");
        return returnVal;
    }

    Authorize() {
        this.setConfiguration().subscribe(v => {
            this.ResetAuthorizationData();
            let url = this.getAuthorizeUrl();
            window.location.href = url;
        });
    }

    AuthorizedCallbackObservable(hashUrl: string): Observable<AuthorizedCallbackModel> {
        return Observable.create(o => {

            this.setConfiguration().subscribe(v => {

                this._logger.debug("OidcSecurityService: AuthorizedCallbackObservable() Start");
                this.ResetAuthorizationData();

                let result: any = hashUrl.substr(1)
                    .split('&').reduce(function (result: any, item: string) {
                        let parts = item.split('=');
                        result[parts[0]] = parts[1];
                        return result;
                    }, {});

                this._logger.debug('OidcSecurityService: AuthorizedCallback() begin token validation');

                let token = '';
                let id_token = '';
                let authResponseIsValid = false;

                this.getSigningKeys()
                    .subscribe(jwtKeys => {
                        this.jwtKeys = jwtKeys;
                        this._logger.debug("OidcSecurityService: AuthorizedCallback() => getSigningKeys().subscribe()");
                        if (!result.error) {
                            result.state = this.fullyDecodeURIComponent(result.state);//2times decodeURIComponent needed for frame element of background token refresh
                            // validate state
                            if (this.oidcSecurityValidation.ValidateStateFromHashCallback(result.state, this.retrieve(StorageKey.S_AuthStateControl))) {
                                token = result.access_token;
                                id_token = result.id_token;
                                this._logger.debug("OidcSecurityService: AuthorizedCallback() token: " + token);
                                this._logger.debug("OidcSecurityService: AuthorizedCallback() id_token: " + id_token);
                                let decoded: any;
                                let headerDecoded;
                                decoded = this.oidcSecurityValidation.GetPayloadFromToken(id_token, false);
                                headerDecoded = this.oidcSecurityValidation.GetHeaderFromToken(id_token, false);

                                // validate jwt signature
                                if (this.oidcSecurityValidation.Validate_signature_id_token(id_token, this.jwtKeys)) {
                                    // validate nonce
                                    if (this.oidcSecurityValidation.Validate_id_token_nonce(decoded, this.retrieve(StorageKey.S_AuthNonce))) {
                                        // validate iss
                                        if (this.oidcSecurityValidation.Validate_id_token_iss(decoded, this._configuration.iss)) {
                                            // validate aud
                                            if (this.oidcSecurityValidation.Validate_id_token_aud(decoded, this._configuration.client_id)) {
                                                // valiadate at_hash and access_token
                                                if (this.oidcSecurityValidation.Validate_id_token_at_hash(token, decoded.at_hash) || !token) {
                                                    this.store(StorageKey.S_AuthNonce, '');
                                                    this.store(StorageKey.S_AuthStateControl, '');
                                                    authResponseIsValid = true;
                                                    this._logger.debug('AuthorizedCallback state, nonce, iss, aud, signature validated, returning token');
                                                } else {
                                                    this._logger.debug('AuthorizedCallback incorrect aud');
                                                }
                                            } else {
                                                this._logger.debug('AuthorizedCallback incorrect aud');
                                            }
                                        } else {
                                            this._logger.debug('AuthorizedCallback incorrect iss');
                                        }
                                    } else {
                                        this._logger.debug('AuthorizedCallback incorrect nonce');
                                    }
                                } else {
                                    this._logger.debug('AuthorizedCallback incorrect Signature id_token');
                                }
                            } else {
                                this._logger.debug('AuthorizedCallback incorrect state');
                            }
                        }
                        if (authResponseIsValid) this.SetAuthorizationData(token, id_token);
                        o.next(new AuthorizedCallbackModel(authResponseIsValid, result.state));
                        o.complete();
                        this._logger.debug("OidcSecurityService: AuthorizedCallbackObservable() End");
                    });//getSigningKeys end
            });//setConfiguration end
        });//create observable end
    }

    IsTokenExpired(): boolean {
        try {
            return this.oidcSecurityValidation.IsTokenExpired(this.GetIdToken());
        }
        catch (e) {
            return true;
        }
    }

    BackgroundAuthorizedCallbackObservable(): Observable<AuthorizedCallbackModel> {
        return Observable.create((o: Observer<AuthorizedCallbackModel>) => {
            this.setConfiguration().subscribe(v => {
                var url = this.getAuthorizeUrl(true);
                let frame = document.createElement("frame");
                document.body.appendChild(frame);
                frame.contentDocument.location.href = url;
                frame.onload = (evt) => {
                    try {
                        if (frame.contentDocument.location.hash) {
                            this.AuthorizedCallbackObservable(frame.contentDocument.location.hash).subscribe(v => {
                                frame.parentNode.removeChild(frame);
                                o.next(v);
                                o.complete();
                            });
                        }
                    }
                    catch (e) {
                        frame.parentNode.removeChild(frame);
                        console.log(e);
                    }
                }
            });//set configuration end
        });//create observable end
    }

    Logoff() {
        this.setConfiguration().subscribe(v => {
            this._logger.debug("OidcSecurityService: Logoff() Start");
            // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
            this._logger.debug('BEGIN Authorize, no auth data');

            let authorizationEndsessionUrl = this._configuration.logoutEndSession_url;

            let id_token_hint = this.GetIdToken();
            let post_logout_redirect_uri = this._configuration.post_logout_redirect_uri;

            let url =
                authorizationEndsessionUrl + '?' +
                'id_token_hint=' + encodeURI(id_token_hint) + '&' +
                'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

            this.ResetAuthorizationData();
            this._logger.debug("OidcSecurityService: Logoff url: " + url);
            this._logger.debug("OidcSecurityService: Logoff() End");
            window.location.href = url;
        });

    }

    NeedTokenRefresh(): boolean {//need to refresh token before 15 seconds of Expiration
        var returnVal = false;
        if (this._isAuthorized && !this.IsTokenExpired()) {
            let ted = this.oidcSecurityValidation.GetTokenExpirationDate(this.GetIdToken());
            ted.setSeconds(ted.getSeconds() - 15);
            if (new Date() >= ted) {
                returnVal = true;
            }
        }
        return returnVal;
    }

    NeedReLogin() {//need to relogin after 20min ideal time
        var returnVal = false;
        if (this._isAuthorized) {
            let ted = this.oidcSecurityValidation.GetTokenExpirationDate(this.GetIdToken());
            ted.setMinutes(ted.getMinutes() + 20);
            if (new Date() > ted) {
                returnVal = true;
            }
        }
        return returnVal;
    }

    private getAuthorizeUrl(background: boolean = false) {

        let authorizationUrl = this._configuration.server + '/connect/authorize';
        if (background) authorizationUrl += '/login';
        let client_id = this._configuration.client_id;
        let redirect_uri = this._configuration.redirect_url;
        let response_type = this._configuration.response_type;
        let scope = this._configuration.scope;
        let nonce = 'N' + Math.random() + '' + Date.now();
        let state = window.location.pathname + window.location.search;
        //if (state == Constants.SlashPath.unauthorized) state = Constants.SlashPath.home;
        this.store(StorageKey.S_AuthStateControl, state);
        this.store(StorageKey.S_AuthNonce, nonce);

        let url =
            authorizationUrl + '?' +
            'response_type=' + encodeURI(response_type) + '&' +
            'client_id=' + encodeURI(client_id) + '&' +
            'redirect_uri=' + encodeURI(redirect_uri) + '&' +
            'scope=' + encodeURI(scope) + '&' +
            'nonce=' + encodeURI(nonce) + '&' +
            'state=' + encodeURIComponent(state);

        this._logger.debug("OidcSecurityService: Generated Authorize Url = " + url);
        return url;
    }

    private setConfiguration(): Observable<boolean> {
        if (!this._configuration) {
            return Observable.create(o => {
                this._configSvc.ConfigurationObservable.subscribe(c => {
                    this._configuration = new AuthConfiguration(c.sso);
                    o.next(true);
                });
            });
        } else {
            return Observable.of(true);
        }
    }

    private GetIdToken() {
        return this.retrieve(StorageKey.S_AuthorizationDataIdToken);
    }

    private ResetAuthorizationData() {
        this._logger.debug("OidcSecurityService: ResetAuthorizationData() Start");
        this.store(StorageKey.S_AuthorizationData, '');
        this.store(StorageKey.S_AuthorizationDataIdToken, '');
        this.store(StorageKey.S_IsAuthorized, false);
        this._isAuthorized = false;
        this._logger.debug("OidcSecurityService: ResetAuthorizationData() End");
    }

    private SetAuthorizationData(token: any, id_token: any) {
        this._logger.debug("OidcSecurityService: SetAuthorizationData() Start");
        this.store(StorageKey.S_AuthorizationData, token);
        this.store(StorageKey.S_AuthorizationDataIdToken, id_token);
        this.store(StorageKey.S_IsAuthorized, true);
        this._isAuthorized = true;
        this._logger.debug("OidcSecurityService: SetAuthorizationData() End");
    }

    private runGetSigningKeys() {
        this._logger.debug("OidcSecurityService: runGetSigningKeys() Start");
        this.getSigningKeys()
            .subscribe(
            jwtKeys => this.jwtKeys = jwtKeys,
            error => this.errorMessage = <any>error);
    }

    private getSigningKeys(): Observable<JwtKeys> {
        return this._http.get(this._configuration.jwks_url)
            .map(this.extractData)
            .catch(this.handleError)
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    private retrieve(key: StorageKey): any {
        return this._storageSvc.get(key, StorageType.Session);
    }

    private store(key: StorageKey, value: any) {
        this._storageSvc.set(key, value, StorageType.Session);
    }

    private isEncoded(uri) {
        uri = uri || '';
        return uri !== decodeURIComponent(uri);
    }

    private fullyDecodeURIComponent(uri) {
        while (this.isEncoded(uri)) {
            uri = decodeURIComponent(uri);
        }
        return uri;
    }

}