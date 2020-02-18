import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'calendarDay'
})
export class CalendarDayPipe implements PipeTransform {
  transform(ts: number): string {
    moment.locale('ru');
    return moment(ts).format('D MMMM YYYY');
  }
}
