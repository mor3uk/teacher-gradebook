import { ValidationErrors, AbstractControl } from '@angular/forms';


export const studentsRequired = (control: AbstractControl): ValidationErrors => {
  if (control.value.length === 0) {
    return { studentsRequired: true };
  }

  return null;
};
