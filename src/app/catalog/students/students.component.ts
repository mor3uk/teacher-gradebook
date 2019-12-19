import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import * as uuid from 'uuid';
import * as moment from 'moment';

import { Student } from '../../shared/models/student.model';
import { StudentService } from '../../shared/services/student.service';
import { ConfirmDialog } from '../../shared/modals/confirm.component';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-students',
  styleUrls: ['students.component.scss'],
  templateUrl: 'students.component.html',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];

  constructor(
    private sw: StudentService,
    private dialog: MatDialog,
  ) {
    // sw.addStudent({
    //   id: uuid(),
    //   name: 'Шурыгин',
    //   surname: 'Данила',
    //   fatherName: 'Олегович',
    //   birthDate: +moment().subtract(19, 'years'),
    //   passedLessons: 15,
    //   visitedLessons: 11,
    // });
  }

  async ngOnInit() {
    this.students = await this.sw.getStudents();
  }

  onAddStudent() {
    this.openDialog('add').subscribe(async (student) => {
      if (student) {
        await this.sw.addStudent(<Student>student);
        this.students = await this.sw.getStudents();
      }
    });
  }

  onDeleteStudent(id: string) {
    this.openDialog('delete').subscribe(async (res) => {
      if (res) {
        this.sw.deleteStudent(id);
        this.students = await this.sw.getStudents();
      }
    });
  }

  getGroupName(id: string) {
    return 'Супер группа';
  }

  openDialog(operation: 'delete' | 'add'): Observable<any> {
    let dialogRef;
    if (operation === 'delete') {
      dialogRef = this.dialog.open(ConfirmDialog);
    } else {
      dialogRef = this.dialog.open(StudentFormComponent);
    }
    return dialogRef.afterClosed();
  }

}