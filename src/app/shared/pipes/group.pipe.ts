import { Pipe, PipeTransform } from '@angular/core';

import { GroupService } from '../services/group.service';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  constructor(private gs: GroupService) { }

  transform(id: string): string {
    if (id === null) {
      return '-';
    }

    const group = this.gs.getGroup(id);

    if (!group) {
      return 'Группа удалена';
    }

    const name: string = group.name;

    if (!isNaN(+name)) {
      return '№' + name;
    }

    if (name.length > 14) {
      return name.substr(0, 11) + '...';
    }

    return name;

  }
}
