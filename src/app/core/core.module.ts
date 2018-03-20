import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as C from '.'

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    C.BrowsersService,
    C.CacheService,
    C.EventEmitterService,
    C.HttpService,
    C.LoggingService,
    C.ResponsiveService,
    C.StorageService,
    C.HackService,
    C.RouterService,
  ],
  declarations: []
})
export class CoreModule { }
