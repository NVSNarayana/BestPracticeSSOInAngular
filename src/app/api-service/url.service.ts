import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class UrlService {
  private _apiBaseUrl: string;

  constructor() {
    this.getApiBaseUrl();
  }

  public get apiBaseUrl(): string {
    return this._apiBaseUrl;
  }

  public get origin(): string {
    return window.location.origin;
  }

  public apiUrl(path: string) {
    return this.apiBaseUrl + "/" + path;
  }

  private getApiBaseUrl() {
    //var url = environment.production ? "api" : "https://otcpricing-dev.azurewebsites.net/api";
    var url = environment.production ? "http://localhost:53413/api" : "http://localhost:53413/api"
    this._apiBaseUrl = url;
  }
}
