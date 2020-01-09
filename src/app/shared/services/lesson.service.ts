import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import uuid from 'uuid';
import { DB } from '../db';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private db: DB;
  private todayLessons: Lesson[] = [];

  todayLessonsChanged = new Subject<Lesson[]>();

  constructor() {
    this.db = new DB();
  }

  addLesson(lesson: Lesson): Promise<any> {
    lesson.id = uuid();
    return this.db.lessons.add(lesson);
  }

  getLesson(id: string): Promise<Lesson> {
    return this.db.lessons.get(id);
  }

  getLessons(): Promise<Lesson[]> {
    return this.db.lessons.toArray();
  }

  getTodayLessons(): Promise<void> {
    return this.db.lessons.toArray()
      .then(lessons => {
        this.todayLessons = lessons;
        this.todayLessonsChanged.next([...this.todayLessons]);
      });
  }

  getCommonLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('common').toArray();
  }

  getPersonalLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('personal').toArray();
  }

}
