import { Injectable, EventEmitter } from '@angular/core';

import * as uuid from 'uuid';

import { GroupService } from './group.service';
import { Student } from '../models/student.model';
import { Group } from '../models/group.model';
import { DB } from '../db';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private db: DB;
  private students: Student[] = [];
  studentsChanged = new EventEmitter<Student[]>();

  constructor(private gs: GroupService) {
    this.db = new DB();
    this.getStudents();
  }

  addStudent(student: Student): Promise<any> {
    if (!student.fatherName) {
      student.fatherName = '';
    }
    student.id = uuid();
    student.passedLessons = 0;
    student.visitedLessons = 0;

    this.gs.replaceStudent(null, student.groupId, student.id);

    return this.db.students.add(student);
  }

  async updateStudent(student: Student, studentMode: boolean = true): Promise<any> {
    if (studentMode) {
      const studentToUpdate = await this.getStudent(student.id);
      this.gs.replaceStudent(studentToUpdate.groupId, student.groupId, student.id);
    }

    if (!student.fatherName) {
      student.fatherName = '';
    }

    return this.db.students.put(student);
  }

  getStudent(id: string): Student {
    return this.students.find(student => student.id === id);
  }

  getStudents(): Promise<void> {
    return this.db.students.toArray().then(students => {
      this.students = students;
      this.studentsChanged.next([...this.students]);
    });
  }

  getFreeStudents(): Student[] {
    return this.students.filter(student => !student.groupId);
  }

  async deleteStudent(id: string): Promise<any> {
    const student = this.getStudent(id);
    this.gs.replaceStudent(student.groupId, null, id);
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

  setStudentsGroup(group: Group) {
    group.studentIdList.forEach(id => {
      const student = this.getStudent(id);
      student.groupId = group.id;
      this.updateStudent(student, false);
    });
  }

  unsetStudentsGroup(idList: string[]) {
    idList.forEach(id => {
      const student = this.getStudent(id);
      student.groupId = null;
      this.updateStudent(student, false);
    });
  }

  getStudentsByGroupId(id: string): Student[] {
    return this.students.filter(student => student.groupId === id);
  }

}
