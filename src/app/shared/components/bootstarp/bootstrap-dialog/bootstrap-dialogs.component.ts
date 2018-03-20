import { Component, OnInit } from '@angular/core';
import { BootstrapDialogService } from './bootstrap-dialog.service';
import { BootstrapComponentDialogArgs } from './bootstrap-dialog-args';

@Component({
    selector: 'app-bootstrap-dialogs',
    template: `<div class="bootstrap-dialogs-container">
  <div *ngFor="let args of dialogArgs">
      <app-bootstrap-dialog [args]="args"></app-bootstrap-dialog>
  </div>
</div>`
})
export class BootstrapDialogsComponent implements OnInit {
    dialogArgs: BootstrapComponentDialogArgs[];
    constructor(private _bootstrapDialogService: BootstrapDialogService) {
        this._bootstrapDialogService.componentDialogsObservable.subscribe(args => {
            this.dialogArgs = args;
        });
    }

    ngOnInit() {

    }
}
