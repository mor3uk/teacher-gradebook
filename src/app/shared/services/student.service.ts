import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import * as uuid from 'uuid';

import { LessonService } from './lesson.service';
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

  studentsChanged = new Subject<Student[]>();
  studentsLoaded = new BehaviorSubject<boolean>(false);

  constructor(
    private gs: GroupService,
    private ls: LessonService,
  ) {
    this.db = new DB();
    this.getStudents().then(() => {
      this.studentsLoaded.next(true);
    });
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

  async updateStudent(student: Student, studentMode: boolean = true): Promise<Student> {
    if (studentMode) {
      const studentToUpdate = await this.getStudent(student.id);
      this.gs.replaceStudent(studentToUpdate.groupId, student.groupId, student.id);
    }

    if (!student.fatherName) {
      student.fatherName = '';
    }

    return this.db.students.put(student).then(() => student);
  }

  getStudent(id: string): Student {
    return this.students.find(student => student.id === id);
  }

  getCurrentStudents(): Student[] {
    return [...this.students];
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

  getStudentsByIdList(idList: string[]): Student[] {
    return this.students.filter(student => idList.includes(student.id));
  }

  async deleteStudent(id: string): Promise<Student> {
    const student = this.getStudent(id);
    this.gs.replaceStudent(student.groupId, null, id);
    this.ls.removeStudentFromLessons(student.lessonsIdList, id);
    return this.db.students.delete(id).then(() => student);
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
    this.getStudents().then(() => {
      group.studentIdList.forEach(id => {
        this.students.forEach(student => {
          if (student.id !== id) {
            return;
          }
          student.groupId = group.id;
          this.updateStudent(student, false);
        });
      });
    });
  }

  unsetStudentsGroup(idList: string[]): Promise<any> {
    const studentsUpdated: Promise<any>[] = [];
    idList.forEach(id => {
      const student = this.getStudent(id);
      student.groupId = null;
      studentsUpdated.push(this.updateStudent(student, false));
    });

    return Promise.all(studentsUpdated);
  }

  getStudentsByGroupId(id: string): Student[] {
    return this.students.filter(student => student.groupId === id);
  }

  addLessonToStudents(studentsIdList: string[], lessonId): Promise<any> {
    const studentsUpdated: Promise<any>[] = [];
    this.students.forEach(student => {
      if (!studentsIdList.includes(student.id)) {
        return;
      }
      if (!student.lessonsIdList) {
        student.lessonsIdList = [];
      }
      student.lessonsIdList.push(lessonId);
      studentsUpdated.push(this.updateStudent(student, false));
    });

    return Promise.all(studentsUpdated);
  }

  removeLessonFromStudents(studentsIdList, lessonId): Promise<any> {
    const studentsUpdated: Promise<any>[] = [];
    this.students.forEach(student => {
      if (!studentsIdList.includes(student.id)) {
        return;
      }
      if (student.lessonsIdList) {
        student.lessonsIdList = student.lessonsIdList.filter(id => id !== lessonId);
        studentsUpdated.push(this.updateStudent(student, false));
      }
    });

    return Promise.all(studentsUpdated);
  }

}
