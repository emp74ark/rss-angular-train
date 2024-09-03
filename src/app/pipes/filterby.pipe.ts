import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  standalone: true,
})
export class FilterByPipe implements PipeTransform {
  transform<T, U>(arr: T[], key: keyof T, value: U, exclude: boolean = false): T[] {
    if (exclude) {
      return arr.filter(el => el[key] !== value);
    }
    return arr.filter(el => el[key] === value);
  }
}
