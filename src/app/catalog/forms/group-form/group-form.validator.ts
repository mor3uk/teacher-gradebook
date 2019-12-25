import { FormControl, ValidationErrors } from '@angular/forms';

export function groupNameTakedValidator({ value }: FormControl): Promise<ValidationErrors> {
  return new Promise(async resolve => {
    const existingGroup = await this.gs.getGroupByName(value);

    if (this.editMode && this.data.group.name === value) {
      resolve(null);
    }

    if (!existingGroup) {
      resolve(null);
    }

    resolve({ groupNameTaken: true });
  });
}