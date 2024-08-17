import { Injectable } from '@angular/core';
import { LogType } from '../models/log';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  logMessage(message: string, type: LogType = 'info', logger: string): void {
    const logMessage = `[${type.toUpperCase()}] [${logger.toUpperCase()}] ${message}`;
    if (!environment.production) {
      switch (type) {
        case 'error':
          console.error(logMessage);
          break;
        case 'warning':
          console.warn(logMessage);
          break;
        default:
          console.info(logMessage);
      }
    }
  }
}
