import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventName, EventEmitterService, RouterService } from '../../core';
import { Template, Constants } from '../../models';
import { TemplateService } from '../../app-service';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.less']
})
export class CorrelationComponent implements OnInit {

  constructor(private _router: Router,
    private _routerSvc: RouterService,
    private _evntSvc: EventEmitterService,
    private _templateSvc: TemplateService) { }

  ngOnInit() {
  }
  goToErrorPage() {
    this._templateSvc.setTemplate(Template.WithoutLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.error]);
    })
  }

  goToUnauthorizedPage() {
    this._templateSvc.setTemplate(Template.WithoutLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.unauthorized]);
    })
  }
  getQueryParams() {
    this._routerSvc.getQueryParams().subscribe(v => {
      console.log(v);
    });
    this._routerSvc.getQueryParam<string>("name").subscribe(v => {
      console.log(v);
    });
  }

  getRouteParams() {
    this._routerSvc.getRouteParam<string>("Id").subscribe(v => {
      console.log(v);
    });
  }
}
