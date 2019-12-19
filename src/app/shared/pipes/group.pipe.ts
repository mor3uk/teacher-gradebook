import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  transform(group: string | number): string {
    if (!isNaN(+group)) {
      return '№' + group;
    }

    return (<string>group).substr(0, 15);
  }
}