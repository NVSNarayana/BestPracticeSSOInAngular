import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule, MatDialogModule, MatIconModule } from "@angular/material";

import { CoreModule } from "../core/core.module";
import { ApiServiceModule } from "../api-service/api-service.module";
import { AppServiceModule } from "../app-service/app-service.module";
import * as S from '.';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,

    CoreModule,
    ApiServiceModule,
    AppServiceModule
  ],
  providers: [
    S.BootstrapDialogService,
    S.OverlayService
  ],
  exports: [
    MatDialogModule,
    MatIconModule,
    S.LayoutComponent,
    S.ErrorComponent,
    S.PageNotFoundComponent,
    S.BootstrapDialogComponent,
    S.BootstrapDialogsComponent,
    S.OverlayComponent,
    S.OverlaysComponent,
    S.SafeHtmlPipe,
    S.DateFormatPipe
  ],
  declarations: [
    S.LayoutComponent,
    S.ErrorComponent,
    S.PageNotFoundComponent,
    S.HomeComponent,
    S.BootstrapDialogComponent,
    S.BootstrapDialogsComponent,
    S.OverlayComponent,
    S.OverlaysComponent,
    S.SafeHtmlPipe,
    S.DateFormatPipe,
    S.UnauthorizedComponent,
    S.TopNavComponent
  ],
  entryComponents: [S.OverlayComponent]
})
export class SharedModule { }
