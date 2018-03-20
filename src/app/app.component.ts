import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';

import { EventEmitterService, EventName, BrowsersService, RouterService } from './core';
import { AuthService } from './api-service';
import { TemplateService } from './app-service';
import { Constants, Template } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  templateNo: Template = Template.WithLoading;

  constructor(private _router: Router,
    private _evntSvc: EventEmitterService,
    private _authSvc: AuthService,
    private _routerSvc: RouterService,
    private _browsersSvc: BrowsersService,/*required for browser back & forward buttons */
    private _templateSvc: TemplateService) {
    this.subscribeEvents();
    this.handleAuthorization();
  }

  ngOnInit() {
  }

  subscribeEvents() {
    this._evntSvc.emitter(EventName.SetTemplate).subscribe((v: Template) => {
      this.templateNo = v;
      this._evntSvc.emitter(EventName.SetTemplateCompleted).emit(v);
    });

    this._evntSvc.emitter(EventName.BrowserButtonClicked).subscribe(slashPath => {
      var template = this._templateSvc.getTemplateBySlashPath(slashPath)
      this._templateSvc.setTemplate(template).subscribe(v => {
        this._router.navigate([slashPath], { replaceUrl: true });
      })
    });
  }

  handleAuthorization() {
    if (window.location.hash) {
      this._authSvc.handleHashCallback().subscribe(v => {//subscribe won't fire for Iframe request
        if (v.isAuthResponseValid) {
          var template = this._templateSvc.getTemplateBySlashPath(v.state);
          this._templateSvc.setTemplate(template).subscribe(s => {
            var params = this._routerSvc.getNavigateParams(v.state);
            this._router.navigate(params.commands, params.extras);
          })
        } else {
          var template = this._templateSvc.getTemplateBySlashPath(Constants.SlashPath.unauthorized);
          this._templateSvc.setTemplate(template).subscribe(s => {
            this._router.navigate([Constants.SlashPath.unauthorized]);
          });
        }
      });
    }
    else {
      if (this._authSvc.isLoggedIn) {
        // this._authSvc.refreshToken().subscribe((v) => {
        //   var template = this._templateSvc.getTemplateBySlashPath(v.state);
        //   this._templateSvc.setTemplate(template).subscribe(s => {
        //     var params = this._routerSvc.getNavigateParams(v.state);
        //     this._router.navigate(params.commands, params.extras);
        //   });
        // });
        this._authSvc.login();
      } else {
        //  alert("appcomponent before login");
        this._authSvc.login();
      }
    }
  }
}
