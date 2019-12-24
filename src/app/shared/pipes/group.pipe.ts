import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  transform(group: string | number): string {
    if (group === null) {
      return '-';
    }

    if (!isNaN(+group)) {
      return '№' + group;
    }

    if ((group + '').length > 14) {
      return (group + '').substr(0, 11) + '...';
    }

    return (<string>group).substr(0, 12);
  }
}