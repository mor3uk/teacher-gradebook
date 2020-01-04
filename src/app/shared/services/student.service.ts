import { Injectable } from '@angular/core';

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

  constructor(private gs: GroupService) {
    this.db = new DB();
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

  getStudent(id: string): Promise<Student> {
    return this.db.students.get(id);
  }

  getStudents(): Promise<Student[]> {
    return this.db.students.toArray();
  }

  async deleteStudent(id: string): Promise<any> {
    const student = await this.getStudent(id);
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
      this.getStudent(id).then(student => {
        student.groupId = group.id;
        this.updateStudent(student, false);
      });
    });
  }

  unsetStudentsGroup(idList: string[]) {
    idList.forEach(id => {
      this.getStudent(id).then(student => {
        student.groupId = null;
        this.updateStudent(student, false);
      });
    });
  }

  getStudentsByGroupId(id: string): Promise<Group[]> {
    return this.db.students.where('groupId').equals(id).toArray();
  }

}
