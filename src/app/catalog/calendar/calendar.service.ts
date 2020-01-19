import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { DayEvent, LessonEvent } from './event.model';
import { Lesson } from '../../shared/models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  lessons: Lesson[] = [];

  constructor(private ls: LessonService) { }

  getDayEvents(): DayEvent[] {
    this.lessons = this.ls.getAllLessons();
    const dayEvents: DayEvent[] = [];

    this.lessons.forEach(lesson => {
      const startDayMs = +moment(lesson.startTime).startOf('day');
      const endDayMs = +moment(lesson.startTime).endOf('day');
      const dayEvent = dayEvents.find(day => +day.start === startDayMs);

      if (dayEvent) {
        dayEvent.title++;
      } else {
        dayEvents.push({
          start: new Date(startDayMs),
          end: new Date(endDayMs),
          title: 1,
        });
      }
    });

    return dayEvents;
  }

  getLessonEvents(): LessonEvent[] {
    const lessonEvents: LessonEvent[] = this.lessons.map(lesson => {
      const endMs = lesson.startTime + lesson.durationMinutes * 60 * 1000;
      return {
        start: new Date(lesson.startTime),
        end: new Date(endMs),
        title: lesson.kind === 'common' ? 'Групповое' : 'Персональное',
        lessonId: lesson.id,
      };
    });

    return lessonEvents;
  }

  getWorkBounds() {
    const startHours = [];
    const endHours = [];
    this.lessons.forEach(lesson => {
      const startHour = moment(lesson.startTime).hours();
      const endHour = moment(lesson.startTime + (lesson.durationMinutes * 60 * 1000)).hours() + 1;
      startHours.push(startHour);
      endHours.push(endHour);
    });

    return {
      start: Math.min(...startHours),
      end: Math.max(...endHours),
    };
  }


}
