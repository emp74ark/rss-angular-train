import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment/moment';

@Pipe({
  name: 'dateDiff',
  standalone: true,
})
export class DateDiffPipe implements PipeTransform {
  transform(time1?: string, time2?: string): string | null {
    if (time1 && time2) {
      const date1 = new Date(time1).getTime();
      const date2 = new Date(time2).getTime();
      const diff = date2 - date1;
      return moment.duration(diff).humanize();
    }
    return null;
  }
}
