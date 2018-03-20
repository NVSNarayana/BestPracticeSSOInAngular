import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { EventEmitterService, EventName } from './event-emitter.service';

@Injectable()
export class BrowsersService {
    constructor(private _location: PlatformLocation, private _evntSvc: EventEmitterService) {
        //browser back and forward buttons click events
        this._location.onPopState(() => {
            _evntSvc.emitter(EventName.BrowserButtonClicked).emit(window.location.pathname);
        });
    }

    isIEOrEdge() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

    isIE10() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            if (parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10) == 10) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    isIE(): boolean {
        var ua = window.navigator.userAgent;
        var trident = ua.indexOf('Trident/');//IE 11
        if (trident > 0) {
            return true;
        }
        var msie = ua.indexOf('MSIE ');//IE 10
        if (msie > 0) {
            return true;
        }
        return false;
    }

    isEdge(): boolean {
        var ua = window.navigator.userAgent;
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return true;
        }
        return false;
    }

    isChrome(): boolean {
        return navigator.userAgent.indexOf("Chrome") != -1
    }

    isOpera(): boolean {
        return (navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1;
    }

    isFirefox(): boolean {
        return navigator.userAgent.indexOf("Firefox") != -1
    }

    isSafari(): boolean {
        return navigator.userAgent.indexOf("Safari") != -1;
    }

    isIPhone() {
        return !!navigator.userAgent.match(/iPhone/i);
    }

    isIphone5Portrait() {
        if (this.isIPhone()) {
            if (window.screen.width === 320 && window.screen.height === 568) {
                return true;
            }
        }
        return false;
    }
    isIPhone5Landscape() {
        if (this.isIPhone()) {
            if (window.screen.width === 568 && window.screen.height === 320) {
                return true;
            }
        }
        return false;
    }

    isIphone6Portrait() {
        if (this.isIPhone()) {
            if (window.screen.width === 375 && window.screen.height === 667) {
                return true;
            }
        }
        return false;
    }
    isIPhone6Landscape() {
        if (this.isIPhone()) {
            if (window.screen.width === 667 && window.screen.height === 375) {
                return true;
            }
        }
        return false;
    }
    isIphone6PlusPortrait() {
        if (this.isIPhone()) {
            if (window.screen.width === 414 && window.screen.height === 736) {
                return true;
            }
        }
        return false;
    }
    isIPhone6PlusLandscape() {
        if (this.isIPhone()) {
            if (window.screen.width === 736 && window.screen.height === 414) {
                return true;
            }
        }
        return false;
    }
}