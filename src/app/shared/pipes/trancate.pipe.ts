import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trancate',
  pure: false,
})
export class TrancatePipe implements PipeTransform {
  transform(value: string, length: number, width: number): string {
    if (value.length < length) {
      return value;
    }
    if (width > window.innerWidth) {
      return value.substr(0, length) + '.';
    }

    return value;
  }
}
