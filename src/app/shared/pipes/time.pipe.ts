import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
  transform(timestamp: number): string {
    const timeString = moment(timestamp).format('HH:mm');
    return timeString;
  }
}
