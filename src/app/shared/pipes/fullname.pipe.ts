import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname',
  pure: true,
})
export class FullnamePipe implements PipeTransform {
  transform(surname: string, name: string, fatherName: string): any {
    let fullNameString = surname + ' ' + name[0].toUpperCase() + '.';
    if (fatherName) {
      fullNameString += fatherName[0].toUpperCase() + '.';
    }

    return fullNameString;
  }
}