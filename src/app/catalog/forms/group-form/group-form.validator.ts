import { FormControl, ValidationErrors } from '@angular/forms';

import { GroupService } from '../../../shared/services/group.service';

export const groupNameTaken = (gs: GroupService, editMode: boolean, name: string) => {
  return ({ value }: FormControl): Promise<ValidationErrors> => {
    return new Promise(async resolve => {
      const existingGroup = await gs.getGroupByName(value);

      if (editMode && name === value) {
        resolve(null);
      }

      if (!existingGroup) {
        resolve(null);
      }

      resolve({ groupNameTaken: true });
    });
  };
};
