import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventEmitterService {
    private _emitter: any = {};
    constructor() {
        //console.log(EventName["Student"] +", "+ EventName[0]);
        Object.keys(EventName).filter(key => isNaN(Number(EventName[key]))).forEach(v => this._emitter[v] = new EventEmitter());
    }

    emitter<T>(name: EventName): EventEmitter<T> {
        return this._emitter[name] as EventEmitter<T>;
    }
}

export enum EventName {
    HttpError, AppModeChanged, 
    SetTemplate, SetTemplateCompleted,
    BrowserButtonClicked, //back and forward buttons

}