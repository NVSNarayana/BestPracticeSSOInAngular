import { GoogleAnalyticsConfigModel } from './google-analytics-config';
import { SsoConfigModel } from './sso-config';

export class OtcConfigModel {
    googleAnalytics: GoogleAnalyticsConfigModel;
    sso: SsoConfigModel;
}