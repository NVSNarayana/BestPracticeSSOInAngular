import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import * as S from '.';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [],
  providers:[
    S.OidcSecurityService,
    S.ConfigurationService
  ]
})
export class SsoModule { }
