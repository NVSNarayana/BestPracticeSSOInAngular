import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs/Rx";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { OverlayArgs } from './overlay-args';
import { OverlayComponent } from './overlay.component';

@Injectable()
export class OverlayService {
  private idPrefix = "overlayId";
  private initial_Z_Index = 1001;
  private _arrArgs: OverlayArgs[];
  private _mdDialogRef: MatDialogRef<OverlayComponent>
  overlayObservable: Subject<OverlayArgs[]>;

  constructor(private _dialog: MatDialog) {
    this._arrArgs = [];
    this.overlayObservable = new Subject<OverlayArgs[]>();
  }

  open(args: OverlayArgs) {
    args.close = this.close.bind(this);
    this._arrArgs.push(args);
    this._arrArgs.forEach((v, index) => {
      v.id = v.id ? v.id : this.idPrefix + index;
      v.zIndex = (this.initial_Z_Index + index).toString();
    });
    this.overlayObservable.next(this._arrArgs);
  }

  close() {
    this._arrArgs.splice(this._arrArgs.length - 1);
    this.overlayObservable.next(this._arrArgs);
  }

  openDialog({ args, width, height, disableClose }: {
    args: OverlayArgs,
    width?: string,
    height?: string,
    disableClose?: boolean
  }) {
    args.id = args.id ? args.id : this.idPrefix + "0";
    let config: MatDialogConfig = new MatDialogConfig();
    config.width = width == null ? '500px' : width;
    config.height = height == null ? '500px' : height;
    config.data = args;
    config.disableClose = disableClose == null ? true : disableClose;
    //console.log(config);
    this._mdDialogRef = this._dialog.open(OverlayComponent, config);
  }

  closeDialog() {
    this._mdDialogRef.close();
  }
}