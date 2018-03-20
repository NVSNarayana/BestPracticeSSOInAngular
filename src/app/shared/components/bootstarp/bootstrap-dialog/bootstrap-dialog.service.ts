import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs/Rx";
import { BootstrapAlertArgs, BootstrapConfirmArgs, BootstrapComponentDialogArgs } from "./bootstrap-dialog-args";

declare var $: any;

@Injectable()
export class BootstrapDialogService {
  private alertId: string = "alertBootstrapId";
  private confirmId: string = "confirmBootstrapId";
  private closeButtonIdPrefix: string = "btnClose";
  private okButtonIdPrefix: string = "btnOk";
  private bootstrapDialogWithComponentIdPrefix: string = "bootstrapDialogWithComponent";

  private _arrComponentDialogArgs: BootstrapComponentDialogArgs[];
  componentDialogsObservable: Subject<BootstrapComponentDialogArgs[]>;

  constructor() {
    //component dialogs
    this._arrComponentDialogArgs = [];
    this.componentDialogsObservable = new Subject<BootstrapComponentDialogArgs[]>();

    //local variables required for jQuery
    var alertId = this.alertId;
    var confirmId = this.confirmId;
    $(document).ready(function () {
      $(document).on('hide.bs.modal', '#' + alertId + ', #' + confirmId, function () {
        $(this).remove();//Remove alert and confirm modals
      });
    });
  }

  //#region alert
  private getAlertDialogTemplate(args: BootstrapAlertArgs) {
    var str = `<div class="modal fade" id="${this.alertId}" role="dialog" tabindex='-1'>
    <div class="modal-dialog">
    
      <div class="modal-content">
        <div class="modal-header" style="display:${args.needHeader ? "block" : "none"};">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">${args.headerHtml}</h4>
        </div>
        <div class="modal-body">
          <div>${args.contentHtml}</div>
        </div>
        <div class="modal-footer" style="display:${args.needHeader ? "block" : "none"};">
          <button type="button" class="btn btn-default" id="${this.closeButtonIdPrefix}_${this.alertId}">Close</button>
        </div>  
      </div>
      
    </div>
  </div>`;
    return str;
  }
  private openAlert(args: BootstrapAlertArgs) {
    var dialogId = this.alertId;
    var closeBtnId = this.closeButtonIdPrefix + "_" + dialogId;
    var str = this.getAlertDialogTemplate(args);
    $("body").append(str);
    var obj = Object.assign({}, { show: true, backdrop: 'static', keyboard: false }, args.settings);
    //console.log(obj);
    $("#" + dialogId).modal(obj);

    $("#" + closeBtnId).on("click", function () {
      $("#" + dialogId).modal("hide");
      if (args.closeCallback && typeof args.closeCallback === "function") {
        args.closeCallback();
      }
    });
  }

  alert(args: BootstrapAlertArgs) {
    this.openAlert(args);
  }
  //#endregion alert

  //#region confirm
  private getConfirmDialogTemplate(args: BootstrapConfirmArgs) {
    var str = `<div class="modal fade" id="${this.confirmId}" role="dialog" tabindex='-1'>
  <div class="modal-dialog">
  
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">${args.headerHtml}</h4>
      </div>
      <div class="modal-body">
        <div>${args.contentHtml}</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" id="${this.okButtonIdPrefix}_${this.confirmId}">${args.okButtonText}</button>
        <button type="button" class="btn btn-default" id="${this.closeButtonIdPrefix}_${this.confirmId}">${args.cancelButtonText}</button>
      </div>  
    </div>
    
  </div>
</div>`;
    return str;
  }
  private openConfirm(args: BootstrapConfirmArgs) {
    var dialogId = this.confirmId;
    var closeBtnId = this.closeButtonIdPrefix + "_" + dialogId;
    var okBtnId = this.okButtonIdPrefix + "_" + dialogId;
    var str = this.getConfirmDialogTemplate(args);
    $("body").append(str);
    var obj = Object.assign({}, { show: true, backdrop: 'static', keyboard: false }, args.settings);
    $("#" + dialogId).modal(obj);

    $("#" + closeBtnId).on("click", function () {
      $("#" + dialogId).modal("hide");
      if (args.closeCallback && typeof args.closeCallback === "function") {
        args.closeCallback();
      }
    });

    $("#" + okBtnId).on("click", function () {
      $("#" + dialogId).modal("hide");
      if (args.okCallback && typeof args.okCallback === "function") {
        args.okCallback();
      }
    });
  }

  confirm(args: BootstrapConfirmArgs) {
    this.openConfirm(args);
  }
  //#endregion alert

  //#region component in alert
  openComponentDialog(args: BootstrapComponentDialogArgs) {
    this._arrComponentDialogArgs.push(args);
    this._arrComponentDialogArgs.forEach((v, index) => v.id = this.bootstrapDialogWithComponentIdPrefix + index);
    var openFn = function () {
      var obj = Object.assign({}, { show: true, backdrop: 'static', keyboard: false }, args.dialogSettings);
      var id = this._arrComponentDialogArgs[this._arrComponentDialogArgs.length - 1].id;
      $("#" + id).modal(obj);
    };
    args.open = openFn.bind(this);
    args.close = this.closeComponentDialog.bind(this);
    this.componentDialogsObservable.next(this._arrComponentDialogArgs);
  }

  closeComponentDialog() {
    var id = this._arrComponentDialogArgs[this._arrComponentDialogArgs.length - 1].id;
    $("#" + id).modal("hide");
    this._arrComponentDialogArgs.splice(this._arrComponentDialogArgs.length - 1);
    this.componentDialogsObservable.next(this._arrComponentDialogArgs);
  }
  //#endregion
}