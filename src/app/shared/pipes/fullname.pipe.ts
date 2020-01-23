import { Pipe, PipeTransform } from '@angular/core';

import { Student } from '../models/student.model';
import { Relative } from '../models/relative.model';

@Pipe({
  name: 'fullname',
  pure: true,
})
export class FullnamePipe implements PipeTransform {
  transform(student: Student | Relative, mode: number): string {
    const name = student.name[0].toUpperCase() + student.name.substr(1);
    const surname = student.surname[0].toUpperCase() + student.surname.substr(1);
    const fatherName = student.fatherName && student.fatherName[0].toUpperCase() + student.fatherName.substr(1);

    let fullNameString: string;

    switch (mode) {
      case 0:
        fullNameString = surname + ' ' + name[0] + '.';
        if (fatherName) {
          fullNameString += fatherName[0] + '.';
        }
        break;
      case 1:
        fullNameString = surname + ' ' + name;
        break;
      case 2:
        fullNameString = name + ' ' + surname;
        break;
      case 3:
        fullNameString = surname + ' ' + name;
        if (fatherName) {
          fullNameString += fatherName[0];
        }
        break;
      case 4:
        fullNameString = surname + ' ' + name + ' ';
        if (fatherName) {
          fullNameString += fatherName;
        }
        break;
    }

    return fullNameString;
  }
}
