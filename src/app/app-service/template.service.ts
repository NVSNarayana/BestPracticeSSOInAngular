import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { EventEmitterService, EventName } from '../core';
import { Template, Constants } from '../models';

@Injectable()
export class TemplateService {
    private _templateSetted: Subject<boolean> = new Subject<boolean>();

    constructor(private _evntSvc: EventEmitterService) {
        this._evntSvc.emitter(EventName.SetTemplateCompleted).subscribe((v: Template) => {
            this._templateSetted.next(true);
        });
    }

    setTemplate(t: Template): Observable<boolean> {
        return Observable.create(o => {
          var sub=   this._templateSetted.subscribe(v => {
                console.log("sub of subject");
                o.next(v);
                o.complete();
                sub.unsubscribe();
            });
            this._evntSvc.emitter(EventName.SetTemplate).emit(t);
        })
    }

    getTemplateBySlashPath(slashPath: string): Template {
        var returnVal;
        slashPath = this.getRouteSlashPath(slashPath);
        switch (slashPath) {
            case Constants.SlashPath.home:
            case Constants.SlashPath.correlation:
                returnVal = Template.WithLayout
                break;
            case Constants.SlashPath.unauthorized:
            case Constants.SlashPath.error:
                returnVal = Template.WithoutLayout
                break;
            default:
                returnVal = Template.WithLoading;
                break;
        }
        return returnVal;
    }

    //Avoid route parameters and query string parameters and take only routepath
    private getRouteSlashPath(slashPath): string {
        var arr = this.splitMulti(slashPath, ['/', '?']);
        return '/' + arr[1];
    }

    private splitMulti(str, tokens): string[] {
        var arr = [];
        var tempChar = tokens[0]; // We can use the first token as a temporary join character
        for (var i = 0; i < tokens.length; i++) {
            str = str.split(tokens[i]).join(tempChar);
        }
        arr = str.split(tempChar);
        return arr;
    }
}