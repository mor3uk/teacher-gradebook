import { ValidationErrors, FormGroup } from '@angular/forms';

import { RelativeKind } from '../../../shared/models/relative.model';

export function parentsValidator(): ValidationErrors {
  const parentsMatch = this.relatives.find((relative) => {
    return relative.kind === RelativeKind.MOTHER
      || relative.kind === RelativeKind.FATHER;
  });

  return parentsMatch ? null : { parentRequired: true };
}

export function existsValidator({ value }: FormGroup): Promise<ValidationErrors> {
  return new Promise(async resolve => {
    const editStudentMatch = this.editMode
      && this.data.student.name === value.name
      && this.data.student.surname === value.surname
      && this.data.student.fatherName === value.fatherName
      && this.data.student.birthDate === +value.birthDate;

    if (editStudentMatch) {
      resolve(null);
    }

    const student = await this.sw.findExistingStudent({
      ...value,
      birthDate: +value.birthDate,
      fatherName: value.fatherName || '',
    });

    if (student) {
      resolve({ studentExists: true });
    }

    resolve(null);
  });
}