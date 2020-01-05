import { ValidationErrors, AbstractControl } from '@angular/forms';

import { RelativeKind } from '../../../shared/models/relative.model';
import { GroupService } from '../../../shared/services/group.service';
import { StudentService } from '../../../shared/services/student.service';

export function parentRequired(): ValidationErrors {
  const parentsMatch = this.relatives.find((relative) => {
    return relative.kind === RelativeKind.MOTHER
      || relative.kind === RelativeKind.FATHER;
  });

  return parentsMatch ? null : { parentRequired: true };
}

export const studentExists = (student: any, editMode: boolean, ss: StudentService) => {
  return ({ value }: AbstractControl): Promise<ValidationErrors> => {
    return new Promise(async resolve => {
      const editStudentMatch = editMode
        && student.name === value.name
        && student.surname === value.surname
        && student.fatherName === value.fatherName
        && student.birthDate === +value.birthDate;

      if (editStudentMatch) {
        resolve(null);
      }

      const existingStudent = await ss.findExistingStudent({
        ...value,
        birthDate: +value.birthDate,
        fatherName: value.fatherName || '',
      });

      if (existingStudent) {
        resolve({ studentExists: true });
      }

      resolve(null);
    });
  };
};

export const groupExists = (gs: GroupService) => {
  return ({ value }: AbstractControl): Promise<ValidationErrors> => {
    return new Promise(async resolve => {
      if (!value || value === 'null') {
        return resolve(null);
      }
      const group = await gs.getGroup(value);

      if (group) {
        resolve(null);
      }

      resolve({ groupDoesNotExist: true });
    });
  };
};
