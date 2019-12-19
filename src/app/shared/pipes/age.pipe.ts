import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(ts: number): string {
    moment.locale('ru');
    const diffString = moment(ts).fromNow();
    const ageArray = diffString.split(' ');

    return ageArray[0] + ' ' + ageArray[1];
  }
}