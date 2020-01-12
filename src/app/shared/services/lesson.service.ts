import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import * as moment from 'moment';
import uuid from 'uuid';

import { DB } from '../db';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private db: DB;
  private lessons: Lesson[] = [];

  lessonsLoaded = new BehaviorSubject<boolean>(false);
  lessonsChanged = new Subject<Lesson[]>();

  constructor() {
    this.db = new DB();

    this.getLessons().then(() => {
      this.lessonsLoaded.next(true);
    });
  }

  addLesson(lesson: Lesson): Promise<any> {
    lesson.id = uuid();
    return this.db.lessons.add(lesson);
  }

  getLesson(id: string): Lesson {
    return this.lessons.find(lesson => lesson.id === id);
  }

  getLessons(): Promise<void> {
    return this.db.lessons.toArray().then(lessons => {
      this.lessons = lessons;
      this.lessonsChanged.next([...this.lessons]);
    });
  }

  getTodayLessons(): Lesson[] {
    const now = moment();
    const startOfDay = +now.startOf('day');
    const endOfDay = +now.endOf('day');

    return this.lessons.filter(lesson =>
      lesson.startTime > startOfDay
      && lesson.startTime < endOfDay
    ).sort((a, b) => (a.startTime - b.startTime));
  }

  getDayLessonsByTimestamp(ts: number): Promise<Lesson[]> {
    const pointInTime = moment(ts);
    const startOfDay = +pointInTime.startOf('day');
    const endOfDay = +pointInTime.endOf('day');

    return this.db.lessons
      .where('startTime')
      .between(startOfDay, endOfDay)
      .toArray();
  }

  getCommonLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('common').toArray();
  }

  getPersonalLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('personal').toArray();
  }

}
