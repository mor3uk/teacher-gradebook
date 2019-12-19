import Dexie from 'dexie';

import { Student } from './models/student.model';
import { Lesson } from './models/lesson.model';

export class DB extends Dexie {
  students: Dexie.Table<Student, string>;
  lessons: Dexie.Table<Lesson, string>;

  constructor() {
    super('teacher-gradebook');
    this.version(1).stores({
      students: 'id,name,surname,groupId',
      lessons: 'id,kind',
    });
  }
}