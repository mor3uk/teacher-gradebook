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
    student.id = uuid();
    return this.db.students.add(student);
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

}
