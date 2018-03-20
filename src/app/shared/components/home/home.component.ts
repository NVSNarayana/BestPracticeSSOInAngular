import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BootstrapDialogService } from '../bootstarp/bootstrap-dialog/bootstrap-dialog.service';
import { BootstrapAlertArgs, BootstrapConfirmArgs, BootstrapComponentDialogArgs } from '../bootstarp/bootstrap-dialog/bootstrap-dialog-args';
import { ErrorComponent } from '../error/error.component';
import { OverlayArgs } from '../overlay/overlay-args';
import { OverlayService } from '../overlay/overlay.service';
import { AuthService, TestService } from '../../../api-service';
import { TemplateService } from '../../../app-service';
import { EventEmitterService, EventName, RouterService } from '../../../core';
import { Template, Constants } from '../../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router,
    private _b: BootstrapDialogService,
    private _oSvc: OverlayService,
    private _authSvc: AuthService,
    private _testSvc: TestService,
    private _evntSvc: EventEmitterService,
    private _routerSvc: RouterService,
    private _templateSvc: TemplateService) {
  }

  ngOnInit() {
  }
  showDialog() {
    //this._b.alert(new BootstrapAlertArgs({contentHtml:"<b>Hi</b>"}));
    //this._b.confirm(new BootstrapConfirmArgs({contentHtml:"R u sure to close?"}));
    var c = new BootstrapComponentDialogArgs({ component: ErrorComponent, needFooter: true });
    this._b.openComponentDialog(c);
  }
  showOverlay() {
    var args = new OverlayArgs({ component: ErrorComponent, needHeader: true, headerHtml: "Error component" });
    //this._oSvc.open(args);
    this._oSvc.openDialog({ args: args });
  }

  goToComp1() {
    this._templateSvc.setTemplate(Template.WithLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.correlation], { queryParams: { name: "Nani" } });
    });
  }

  login() {
    this._authSvc.login();
  }

  logout() {
    this._authSvc.logout();
  }

  isAuthorized() {
    console.log(this._authSvc.isAuthorized);
  }

  isTokenExpired() {
  }

  backgroundRefresh() {

  }

  isNonIfmUser() {
    this._testSvc.isNonIfmCustomer().subscribe(v => {
      console.log("isNonIfmCustomer " + v);
      console.log(v);
    },
      e => { console.log("error: " + e); },
      () => { console.log("completed.") })
  }

  goToErrorPage() {
    this._templateSvc.setTemplate(Template.WithoutLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.error])
    })
  }

  getRouteParams() {
    this._routerSvc.getRouteParam<string>("Id").subscribe(v => {
      console.log(v);
    });
  }

  getQueryParams() {
    this._routerSvc.getQueryParams().subscribe(v => {
      console.log(v);
    })
    this._routerSvc.getQueryParam<string>("Id").subscribe(v => {
      console.log(v);
    });
  }

  navigateByRoute() {
    this._router.navigate(["/home", "20"])
  }

  withoutLayout() {
    this._templateSvc.setTemplate(Template.WithoutLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.correlation])
    })
  }
  withLayout() {
    this._templateSvc.setTemplate(Template.WithLayout).subscribe(v => {
      this._router.navigate([Constants.SlashPath.error])
    })
  }
}
