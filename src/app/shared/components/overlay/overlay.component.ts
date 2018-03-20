import { Component, OnInit, Input, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayArgs } from './overlay-args'

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less']

})
export class OverlayComponent implements OnInit {

  @Input() args: OverlayArgs;

  constructor( @Optional() private _dialogRef: MatDialogRef<OverlayComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _dialogData: OverlayArgs) {
    if (this._dialogRef != null && this._dialogData != null) {
      _dialogData.needBackArrow = false;
      this.args = _dialogData;
    }
  }

  ngOnInit() {
  }

  closeOverlay() {
    this.args.close();
  }
}
