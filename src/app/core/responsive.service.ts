import { Injectable, HostListener } from '@angular/core';
import { DEFAULT_BREAKPOINTS, BreakPoint } from '@angular/flex-layout';
import { EventEmitterService, EventName } from './event-emitter.service';


export const MobileBreakpoint = 750;
export const TabletBreakpoint = 960;
export const MediumScreenBreakpoint = 1280;

@Injectable()
export class ResponsiveService {
    private _currentMode: AppMode;
    private _currentOrientation: DeviceMode;

    constructor(private _evntSvc: EventEmitterService) {
        window.onresize = this.onResize.bind(this);
        this.setCurrentMode(window.innerWidth, window.innerHeight);
        this.setCurrentOrientation();
    }

    get currentMode() { return this._currentMode; }

    get isMobile() { return this.currentMode == AppMode.Mobile; }

    get isTablet() { return this.currentMode == AppMode.Tablet; }

    get isLargeDesktop() { return this.currentMode == AppMode.Desktop; }

    get isMediumDesktop() { return this.currentMode == AppMode.Laptop; }

    get isMobileOrTablet() { return this.isMobile || this.isTablet; }

    get isMobileOrTabletOrLaptop() { return this.isMobile || this.isTablet || this.isMediumDesktop; }

    get isTabletOrDesktop() { return this.isTablet || this.isDesktop; }

    get isDesktop() { return this.isLargeDesktop || this.isMediumDesktop; }

    get isLandscapeMode() { return this._currentOrientation == DeviceMode.LandScape; }

    get isPortraitMode() { return this._currentOrientation == DeviceMode.Portrait }

    private onResize(event) {
        this.setCurrentMode(window.innerWidth, window.innerHeight);
        this.setCurrentOrientation();
    }

    setCurrentOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            this._currentOrientation = DeviceMode.Portrait;
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            this._currentOrientation = DeviceMode.LandScape;
        }
        this._evntSvc.emitter(EventName.AppModeChanged).emit(this._currentMode);
    }

    private setCurrentMode(width: number, height: number) {
        let previousMode = this._currentMode;
        if (width < MobileBreakpoint) this._currentMode = AppMode.Mobile;
        else if (width < TabletBreakpoint) this._currentMode = AppMode.Tablet;
        else if (width < MediumScreenBreakpoint) this._currentMode = AppMode.Laptop;
        else this._currentMode = AppMode.Desktop;

        if (previousMode != this._currentMode) {
            this._evntSvc.emitter(EventName.AppModeChanged).emit(this._currentMode);
        }
    }

    static updateFlexBreakpoints(breakPoint: BreakPoint) {
        let maxWidth: string = '(max-width: ';
        let minWidth: string = '(min-width: ';
        let pixels: string = 'px)';
        switch (breakPoint.alias) {
            case 'xs': breakPoint.mediaQuery = maxWidth + (MobileBreakpoint - 1) + pixels; break;
            case 'sm': breakPoint.mediaQuery = minWidth + MobileBreakpoint + pixels + ' and ' + maxWidth + (TabletBreakpoint - 1) + pixels; break;
            case 'lt-sm': breakPoint.mediaQuery = maxWidth + (MobileBreakpoint - 1) + pixels; break;
            case 'gt-xs': breakPoint.mediaQuery = minWidth + MobileBreakpoint + pixels; break;
        }
        return breakPoint;
    }

    get screenWidth() { return window.innerWidth; }
    get screenHeight() { return window.innerHeight; }
}

export enum AppMode {
    Desktop,
    Tablet,
    Mobile,
    Laptop
}

export enum DeviceMode {
    LandScape,
    Portrait
}
