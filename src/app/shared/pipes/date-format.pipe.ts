import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from '@angular/common';

@Pipe({
    name: "dateFormat"
})
export class DateFormatPipe implements PipeTransform {
    transform(value: any, format: FormatTypes): string {
        var returnVal = "";

        if (value) {
            var dt = new Date(value);

            if (this.detectIE()) {
                return this.formatIEDateTime(dt, format);
            }
            else {
                var datePipe = new DatePipe("en-US");
                switch (format) {
                    case FormatTypes.LongDate:
                        returnVal = datePipe.transform(dt, DateFormats.LongDate);
                        break;
                    case FormatTypes.LongDateTime:
                        returnVal = datePipe.transform(dt, DateFormats.LongDateTime);
                        break;
                    case FormatTypes.ShortDate:
                        returnVal = datePipe.transform(dt, DateFormats.ShortDate);
                        break;
                    case FormatTypes.ShortDateTime:
                        returnVal = datePipe.transform(dt, DateFormats.ShortDateTime);
                        break;
                    default:
                        returnVal = datePipe.transform(dt, DateFormats.ShortDateTime);
                        break;
                }
            }
        }
        return returnVal;
    }

    formatIEDateTime(dt: Date, format: FormatTypes): string {
        var returnVal = "";
        var datePipe = new DatePipe("en-US");
        switch (format) {
            case FormatTypes.LongDate:
                returnVal = datePipe.transform(dt, DateFormats.LongDate);
                break;
            case FormatTypes.LongDateTime:
                returnVal = datePipe.transform(dt, DateFormats.LongDate) + ", " + this.formatTime(dt);
                break;
            case FormatTypes.ShortDate:
                returnVal = datePipe.transform(dt, DateFormats.ShortDate);
                break;
            case FormatTypes.ShortDateTime:
                returnVal = datePipe.transform(dt, DateFormats.ShortDate) + ", " + this.formatTime(dt);
                break;
            default:
                returnVal = datePipe.transform(dt, DateFormats.ShortDate) + ", " + this.formatTime(dt);
                break;

        }
        return returnVal;
    }

    formatTime(date): string {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    private detectIE() {
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
}

export enum FormatTypes {
    LongDate,
    LongDateTime,
    ShortDate,
    ShortDateTime
}

const DateFormats = {
    LongDate: "MM/dd/yyyy",
    LongDateTime: "MM/dd/yyyy, hh:mm a",
    ShortDate: "MM/dd/yy",
    ShortDateTime: "MM/dd/yy, hh:mm a"
}
