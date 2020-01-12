import { ValidationErrors, AbstractControl, FormGroup } from '@angular/forms';

import { LessonService } from '../../shared/services/lesson.service';

export const studentsRequired = (control: AbstractControl): ValidationErrors => {
  if (control.value.length === 0) {
    return { studentsRequired: true };
  }

  return null;
};

export const timeTaken = (ls: LessonService) => {
  return async (form: FormGroup): Promise<ValidationErrors> => {
    const startMs = form.controls.startTime.value;
    const endMs = startMs + form.controls.durationMinutes.value * 60 * 1000;
    const lessonsAtDay = await ls.getDayLessonsByTimestamp(startMs);

    const timeBoundList = lessonsAtDay.map(lesson => ({
      startMs: lesson.startTime,
      endMs: lesson.startTime + lesson.durationMinutes * 60 * 1000,
    }));

    const timeBound = timeBoundList.find(bound => {
      if (startMs >= bound.startMs && startMs <= bound.endMs) {
        return true;
      }
      if (endMs <= bound.endMs && endMs >= bound.startMs) {
        return true;
      }
      if (endMs >= bound.endMs && startMs <= bound.startMs) {
        return true;
      }
    });

    if (timeBound) {
      return {
        timeTaken: true,
      };
    }

    return null;
  };
};
