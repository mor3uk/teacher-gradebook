import { Moment } from 'moment';
import { AbstractControl } from '@angular/forms';

export const minTime = (time: Moment) => {
  return ({ value }: AbstractControl) => {
    if (!value) {
      return null;
    }
    if (+value < +time) {
      return {
        minTime: true
      };
    }
    return null;
  };
};
