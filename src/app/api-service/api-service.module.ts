import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import * as A from '.'

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  providers: [
    A.UrlService,
    A.TestService,
    A.AuthService, 
  ],
  declarations: []
})
export class ApiServiceModule { }
