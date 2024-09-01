import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(time1?: string, time2?: string): string | null {
    if (time1 && time2) {
      const date1 = new Date(time1).getTime();
      const date2 = new Date(time2).getTime();
      const diff = date2 - date1;
      const milliseconds = diff > 0 ? diff : diff * -1;

      const divMod = (n: number, m: number) => [Math.floor(n / m), n % m];
      const [days, daysRest] = divMod(milliseconds, 864e5);
      const [hours, hoursRest] = divMod(daysRest, 36e5);
      const [minutes] = divMod(hoursRest, 6e4);
      return [days > 0 ? `${days}d` : null, hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}min` : null]
        .filter(v => !!v)
        .join(' ');
    }
    return null;
  }
}
