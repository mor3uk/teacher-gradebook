import { Pipe, PipeTransform } from '@angular/core';

import { GroupService } from '../services/group.service';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  constructor(private gs: GroupService) { }

  transform(id: string): Promise<string> {
    if (id === null) {
      return Promise.resolve('-');
    }

    return new Promise(async resolve => {
      const group = await this.gs.getGroup(id);
      const name = group.name;

      if ((name + '').length > 14) {
        resolve((name + '').substr(0, 11) + '...');
      }

      resolve((<string>name).substr(0, 12));
    });

  }
}