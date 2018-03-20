import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { BootstrapComponentDialogArgs } from './bootstrap-dialog-args';

@Component({
  selector: 'app-bootstrap-dialog',
  templateUrl: './bootstrap-dialog.component.html',
  styleUrls: ['./bootstrap-dialog.component.less']
})
export class BootstrapDialogComponent implements OnInit, AfterViewInit {

  @Input() args: BootstrapComponentDialogArgs;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.args.open();//actual dialog will open from this callback function
  }

  handleOK() {
    if (this.args.okCallback && typeof this.args.okCallback === "function") {
      this.args.okCallback();
    }
    this.args.close();//actual dialog will close from this callback function
  }

  handleCancel() {
    if (this.args.cancelCallback && typeof this.args.cancelCallback === "function") {
      this.args.cancelCallback();
    }
    this.args.close();//actual dialog will close from this callback function
  }

}
