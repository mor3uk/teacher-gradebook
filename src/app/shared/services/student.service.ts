import { Injectable } from '@angular/core';

import * as uuid from 'uuid';

import { Student } from '../models/student.model';
import { DB } from '../db';

@Injectable({
  'providedIn': 'root'
})
export class StudentService {
  private db: DB;

  constructor() {
    this.db = new DB();
  }

  addStudent(student: Student): Promise<any> {
    if (!student.fatherName) {
      student.fatherName = '';
    }
    student.id = uuid();
    student.passedLessons = 0;
    student.visitedLessons = 0;
    return this.db.students.add(student);
  }

  updateStudent(student: Student): Promise<any> {
    if (!student.fatherName) {
      student.fatherName = '';
    }
    return this.db.students.put(student);
  }

  getStudent(id: string): Promise<Student> {
    return this.db.students.get(id);
  }

  getStudents(): Promise<Student[]> {
    return this.db.students.toArray();
  }

  deleteStudent(id: string): Promise<any> {
    return this.db.students.delete(id);
  }

  findExistingStudent(student: Student): Promise<Student> {
    return this.db.students
      .where({
        name: student.name,
        surname: student.surname,
        fatherName: student.fatherName,
        birthDate: student.birthDate,
      })
      .first();
  }

}
