import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import uuid from 'uuid';

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
  pending: boolean = false;

  constructor(
    private sw: StudentService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.pending = true;
    this.students = await this.sw.getStudents();
    this.pending = false;
  }

  onAddStudent() {
    this.openDialog('add').subscribe(async (student) => {
      if (student) {
        await this.sw.addStudent(<Student>student);
        this.students = await this.sw.getStudents();
      }
    });
  }

  async onEditStudent(id: string) {
    const student = await this.sw.getStudent(id);
    this.openDialog('edit', student).subscribe(async (student) => {
      if (student) {
        this.sw.updateStudent(student);
        this.students = await this.sw.getStudents();
      }
    });
  }

  onDeleteStudent(id: string) {
    this.openDialog('delete').subscribe(async (res) => {
      if (res) {
        await this.sw.deleteStudent(id);
        this.students = await this.sw.getStudents();
      }
    });
  }

  getGroupName(id: string) {
    return 'Супер группа';
  }

  openDialog(operation: 'delete' | 'add' | 'edit', student?: Student): Observable<any> {
    switch (operation) {
      case 'delete':
        return this.dialog.open(ConfirmDialog).afterClosed();
      case 'add':
        return this.dialog.open(StudentFormComponent).afterClosed();
      case 'edit':
        return this.dialog.open(
          StudentFormComponent, {
          data: { student }
        }).afterClosed();
    }
  }

}