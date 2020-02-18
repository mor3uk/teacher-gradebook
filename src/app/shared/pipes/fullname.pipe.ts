import { Pipe, PipeTransform } from '@angular/core';

import { Student } from '../models/student.model';
import { Relative } from '../models/relative.model';

@Pipe({
  name: 'fullname',
  pure: true,
})
export class FullnamePipe implements PipeTransform {
  transform(student: Student | Relative, formatString: string): string {
    const name = student.name[0].toUpperCase() + student.name.substr(1);
    const surname = student.surname[0].toUpperCase() + student.surname.substr(1);
    const fatherName = student.fatherName && student.fatherName[0].toUpperCase() + student.fatherName.substr(1);

    let fullNameString = formatString;

    fullNameString = fullNameString.replace('{N}', name);
    fullNameString = fullNameString.replace('{S}', surname);
    fullNameString = fullNameString.replace('{n}', name[0] + '.');
    fullNameString = fullNameString.replace('{s}', surname[0] + '.');

    if (fatherName) {
      fullNameString = fullNameString.replace('{F}', fatherName);
      fullNameString = fullNameString.replace('{f}', fatherName[0] + '.');
    } else {
      fullNameString = fullNameString.replace('{F}', '');
      fullNameString = fullNameString.replace('{f}', '');
    }

    return fullNameString;
  }
}
