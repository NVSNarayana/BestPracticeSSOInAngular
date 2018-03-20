import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule, MatDialogModule, MatIconModule } from "@angular/material";

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ApiServiceModule } from './api-service/api-service.module';
import { AppServiceModule } from './app-service/app-service.module';
import { SsoModule } from './sso/sso.module';
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,

    CoreModule,
    ApiServiceModule,
    AppServiceModule,
    SharedModule,
    SsoModule,
    ComponentsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
