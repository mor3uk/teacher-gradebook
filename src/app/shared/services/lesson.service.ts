import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import * as moment from 'moment';
import uuid from 'uuid';

import { Lesson } from '../models/lesson.model';
import { Student } from '../models/student.model';
import { DB } from '../db';

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

  addLesson(lesson: Lesson): Promise<Lesson> {
    lesson.id = uuid();
    return this.db.lessons.add(lesson).then(() => lesson);
  }

  updateLesson(id: string): Promise<any> {
    const lesson = this.getLesson(id);
    return this.db.lessons.put(lesson);
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

  deleteLesson(id: string): Promise<Lesson> {
    const lesson = this.getLesson(id);
    return this.db.lessons.delete(id).then(() => lesson);
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

  removeStudentFromLessons(lessonIdList: string[], studentId: string) {
    if (!lessonIdList || lessonIdList.length === 0) {
      return;
    }
    this.lessons.forEach(lesson => {
      if (!lessonIdList.includes(lesson.id)) {
        return;
      }
      lesson.studentsInfo = lesson.studentsInfo.filter(info => info.id !== studentId);
      this.updateLesson(lesson.id);
    });
  }

  checkStudentsCompatibility(lesson: Lesson, students: Student[]) {
    const studentsIdList = students.map(student => student.id);
    const startIdLength = lesson.studentsInfo.length;
    lesson.studentsInfo = lesson.studentsInfo.filter(info => studentsIdList.includes(info.id));
    const studentsIdList2 = lesson.studentsInfo.map(info => info.id);

    if (lesson.studentsInfo.length === studentsIdList.length) {
      if (startIdLength !== studentsIdList2.length) {
        this.updateLesson(lesson.id);
      }
      return;
    }

    studentsIdList.forEach(id => {
      if (studentsIdList2.includes(id)) {
        return;
      }
      lesson.studentsInfo.push({ id });
    });
    this.updateLesson(lesson.id);
  }

}
