import { Component, OnInit, Input, Optional, Inject } from '@angular/core';
import { OverlayService } from './overlay.service';
import { OverlayArgs } from './overlay-args';

@Component({
    selector: 'app-overlays',
    template: `<div class="overlays-container">
  <div *ngFor="let args of overlayArgs">
      <app-overlay [args]="args"></app-overlay>
  </div>
</div>
  `
})
export class OverlaysComponent implements OnInit {
    overlayArgs: OverlayArgs[];
    constructor(private _overlayService: OverlayService) {
        //overlay components subscription
        this._overlayService.overlayObservable.subscribe(args => {
            this.overlayArgs = args;
        });
    }

    ngOnInit() {

    }
}
