import Dexie from 'dexie';

import { Student } from './models/student.model';
import { Lesson } from './models/lesson.model';
import { Group } from './models/group.model';

export class DB extends Dexie {
  students: Dexie.Table<Student, string>;
  lessons: Dexie.Table<Lesson, string>;
  groups: Dexie.Table<Group, string>;

  constructor() {
    super('teacher-gradebook');
    this.version(1).stores({
      students: 'id,name,surname,fatherName,birthDate,group,[name+surname+fatherName+birthDate]',
      groups: 'name',
      lessons: 'id,kind',
    });
  }
}