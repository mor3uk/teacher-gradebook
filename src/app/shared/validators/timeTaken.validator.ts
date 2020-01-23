import { ValidationErrors, FormGroup } from '@angular/forms';

import { LessonService } from '../services/lesson.service';

export const timeTaken = (ls: LessonService, data: any) => {
  return (form: FormGroup): ValidationErrors => {
    const startMs = +form.controls.startTime.value;
    const endMs = startMs + form.controls.durationMinutes.value * 60 * 1000;
    let lessonsAtDay = ls.getDayLessonsByTimestamp(startMs);

    if (data) {
      const idsToDelete = data.changes.delete;
      const lessonsToAdd = [...data.changes.add];
      const dayLessonsToAddd = ls.getDayLessonsByTimestamp(startMs, lessonsToAdd);
      lessonsAtDay = lessonsAtDay.filter(lesson => !idsToDelete.includes(lesson.id));
      lessonsAtDay.push(...dayLessonsToAddd);
    }

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
