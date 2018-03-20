import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SsoModule } from '../sso/sso.module';
import { ApiServiceModule } from '../api-service/api-service.module';
import * as A from '.'

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SsoModule,
    ApiServiceModule
  ],
  declarations: [],
  providers: [
    A.AppStorageService,
    A.DataCacheService,
    A.TemplateService
  ]
})
export class AppServiceModule { }
