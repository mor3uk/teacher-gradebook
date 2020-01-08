import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(ts: number): string {
    moment.locale('ru');
    const ageString = moment(ts).fromNow(true);

    return ageString;
  }
}
