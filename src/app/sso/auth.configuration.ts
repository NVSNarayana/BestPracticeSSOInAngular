import { Injectable } from '@angular/core';

import { SsoConfigModel } from "../models/sso-config";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/Rx';
import { OtcConfigModel } from '../models';

declare var getSsoConfig: any;

@Injectable()
export class AuthConfiguration {
    private _authority: string = null;

    constructor(ssoConfig: SsoConfigModel) {

        this.redirect_url = window.location.protocol + '//' + window.location.hostname;
        if (window.location.port != "") this.redirect_url += ':' + window.location.port;

        let authority = environment.production && ssoConfig != null ? ssoConfig.authority : 'https://sso-beta.intlfcstone.com';
        this.iss = authority;
        this.server = authority;
        this.jwks_url = authority + '/.well-known/openid-configuration/jwks';
        this.userinfo_url = authority + '/connect/userinfo';
        this.logoutEndSession_url = authority + '/connect/endsession';

        this.client_id = ssoConfig != null ? ssoConfig.clientId : '751869a2-fe4d-4eeb-a6a8-f0ba774b5699';
    }

    // The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
    public iss: string;

    public server: string;

    public redirect_url = null;

    // This is required to get the signing keys so that the signiture of the Jwt can be validated.
    public jwks_url: string;

    public userinfo_url: string;

    public logoutEndSession_url: string;

    // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
    public client_id: string;

    public response_type = 'id_token token';

    public scope = 'openid profile email Identity.Api OTCApi';

    public post_logout_redirect_uri = window.location.origin;
}