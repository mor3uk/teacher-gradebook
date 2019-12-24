import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
  transform(word: string, number: number, forms: string[]): string {
    return word + (number % 10 == 1 && number % 100 != 11
      ? forms[0]
      : (number % 10 >= 2 && number % 10 <= 4
        && (number % 100 < 10
          || number % 100 >= 20) ? forms[1] : forms[2]));
  }
}