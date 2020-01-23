import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { StudentService } from '../../shared/services/student.service';
import { DayEvent, LessonEvent } from './event.model';
import { Lesson, PersonalLesson } from '../../shared/models/lesson.model';
import { Changes } from './changes.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  lessons: Lesson[] = [];

  constructor(
    private ls: LessonService,
    private ss: StudentService,
  ) { }

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

  setUpdates(changes: Changes): Promise<any> {
    const promises = [];
    changes.delete.forEach(id => {
      promises.push(
        this.ls.deleteLesson(id).then(lesson => {
          const studentsIdList = lesson.studentsInfo.map(info => info.id);
          if (this.ls.isLessonEnded(lesson) || lesson.kind === 'common') {
            this.ss.removeLessonFromStudents(studentsIdList, lesson.id);
          } else {
            this.ss.removeLessonFromStudents(studentsIdList, lesson.id, (lesson as PersonalLesson).price);
          }

        })
      );
    });

    changes.add.forEach(lesson => {
      this.ls.addLesson(lesson).then(newLesson => {
        const idList = newLesson.studentsInfo.map(info => info.id);
        if (lesson.kind === 'personal') {
          promises.push(
            this.ss.addLessonToStudents(idList, newLesson.id, (newLesson as PersonalLesson).price)
          );
        } else {
          promises.push(this.ss.addLessonToStudents(idList, newLesson.id));
        }
      });
    });


    return Promise.all(promises);
  }

  isOneDay(ts1: number, ts2: number) {
    const startOfDay1 = +moment(ts1).startOf('day');
    const startOfDay2 = +moment(ts2).startOf('day');
    return startOfDay1 === startOfDay2;
  }

}
