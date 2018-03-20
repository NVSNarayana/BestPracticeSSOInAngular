import { Injectable } from '@angular/core';

@Injectable()
export class LoggingService {

  constructor() { }

  debug(msg: string) {
    console.debug(msg);
  }

  info(msg: string) {
    console.info(msg);
  }

  warn(msg: string) {
    console.warn(msg);
  }

  error(msg: string) {
    console.error(msg);
  }
}
