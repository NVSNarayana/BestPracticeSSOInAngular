import { Injectable } from '@angular/core';

@Injectable()
export class HackService {
    constructor() {
    }
    isIframeRequest(): boolean {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
}