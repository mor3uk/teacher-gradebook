import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'birthdate'
})
export class BitrhDatePipe implements PipeTransform {
  transform(ms: number): string {
    moment.locale('ru');
    return moment(+ms).format('ll');
  }
}