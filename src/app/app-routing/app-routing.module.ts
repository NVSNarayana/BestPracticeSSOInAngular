import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module'
import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
