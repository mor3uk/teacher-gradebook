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
    if (!lesson.id) {
      lesson.id = uuid();
    }
    if (!lesson.studentsInfo || !lesson.studentsInfo.length) {
      lesson.studentsInfo = [];
    }
    return this.db.lessons.add(lesson).then(() => lesson);
  }

  updateLesson(lesson: Lesson, updateState = false): Promise<any> {
    if (updateState) {
      const lessonI = this.lessons.findIndex(les => les.id === lesson.id);
      this.lessons[lessonI] = lesson;
    }
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

  getAllLessons(): Lesson[] {
    return [...this.lessons];
  }

  getTodayLessons(): Lesson[] {
    return this.lessons.filter(lesson => this.isLessonToday(lesson))
      .sort((a, b) => (a.startTime - b.startTime));
  }

  getDayLessonsByTimestamp(ts: number, lessons?: Lesson[]): Lesson[] {
    const startOfDay1 = +moment(ts).startOf('day');

    if (!lessons) {
      lessons = this.lessons;
    }

    return lessons.filter(lesson => {
      const startOfDay2 = +moment(lesson.startTime).startOf('day');
      return startOfDay1 === startOfDay2;
    })
      .sort((a, b) => (a.startTime - b.startTime));
  }

  getCommonLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('common').toArray();
  }

  getPersonalLessons(): Promise<Lesson[]> {
    return this.db.lessons.where('kind').equals('personal').toArray();
  }

  removeStudentFromLessons(lessonIdList: string[], studentId: string): Promise<any> {
    const lessonsUpdated: Promise<any>[] = [];
    if (!lessonIdList || lessonIdList.length === 0) {
      return Promise.resolve();
    }
    this.lessons.forEach(lesson => {
      if (!lessonIdList.includes(lesson.id)) {
        return;
      }
      lesson.studentsInfo = lesson.studentsInfo.filter(info => info.id !== studentId);
      lessonsUpdated.push(this.updateLesson(lesson));
    });
    return Promise.all(lessonsUpdated);
  }

  addStudentsToLesson(lessonId: string, studentsIdList: string[]) {
    this.lessons.forEach(lesson => {
      if (lessonId === lesson.id) {
        const studentsInfo = studentsIdList.map(id => ({ id }));
        lesson.studentsInfo.push(...studentsInfo);
        this.updateLesson(lesson);
      }
    });
  }

  checkStudentsCompatibility(lesson: Lesson, students: Student[]) {
    const studentsIdList = students.map(student => student.id);
    const startIdLength = lesson.studentsInfo.length;
    lesson.studentsInfo = lesson.studentsInfo.filter(info => studentsIdList.includes(info.id));
    const studentsIdList2 = lesson.studentsInfo.map(info => info.id);

    if (lesson.studentsInfo.length === studentsIdList.length) {
      if (startIdLength !== studentsIdList2.length) {
        this.updateLesson(lesson);
      }
      return;
    }

    studentsIdList.forEach(id => {
      if (studentsIdList2.includes(id)) {
        return;
      }
      lesson.studentsInfo.push({ id });
    });
    this.updateLesson(lesson);
  }

  isLessonEnded(lesson: Lesson): boolean {
    const durationMs = lesson.durationMinutes * 60 * 1000;
    const diff = +moment() - (lesson.startTime + durationMs);
    return diff > 0;
  }

  makeLessonCopy(lesson: Lesson, time: number): Lesson {
    const lessonCopy = { ...lesson };
    lessonCopy.id = uuid();
    lessonCopy.startTime = time;
    lessonCopy.studentsMarked = false;
    lessonCopy.studentsInfo.forEach(info => {
      info = { id: info.id };
    });

    return lessonCopy;
  }

  isLessonToday(lesson) {
    const startDay1 = +moment(lesson.startTime).startOf('day');
    const startDay2 = +moment().startOf('day');
    return startDay1 === startDay2;
  }
}
