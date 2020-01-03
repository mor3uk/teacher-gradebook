import { Injectable } from '@angular/core';

import uuid from 'uuid';
import { DB } from '../db';
import { Lesson } from '../models/lesson.model';

@Injectable({
  'providedIn': 'root'
})
export class LessonService {
  private db: DB;

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

  getCommonLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('common').toArray();
  }

  getPersonalLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('personal').toArray();
  }

}
