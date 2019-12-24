import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { Student } from '../../shared/models/student.model';
import { StudentService } from '../../shared/services/student.service';
import { ConfirmDialog } from '../../shared/modals/confirm.component';
import { StudentFormComponent } from '../forms/student-form/student-form.component';
import { GroupService } from '../../shared/services/group.service';

@Component({
  selector: 'app-students',
  styleUrls: ['students.component.scss'],
  templateUrl: 'students.component.html',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  pending: boolean = false;

  constructor(
    private ss: StudentService,
    private gs: GroupService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.pending = true;
    this.students = await this.ss.getStudents();
    this.pending = false;
  }

  onAddStudent() {
    this.openDialog('add').subscribe(async (student) => {
      if (student) {
        await this.ss.addStudent(<Student>student);
        this.students = await this.ss.getStudents();
      }
    });
  }

  async onEditStudent(id: string) {
    const student = await this.ss.getStudent(id);
    this.openDialog('edit', student).subscribe(async (student) => {
      if (student) {
        await this.ss.updateStudent(student);
        this.students = await this.ss.getStudents();
      }
    });
  }

  onDeleteStudent(id: string) {
    this.openDialog('delete').subscribe(async (res) => {
      if (res) {
        await this.ss.deleteStudent(id);
        this.students = await this.ss.getStudents();
      }
    });
  }

  openDialog(operation: 'delete' | 'add' | 'edit', student?: Student): Observable<any> {
    switch (operation) {
      case 'delete':
        return this.dialog.open(ConfirmDialog).afterClosed();
      case 'add':
        return this.dialog.open(StudentFormComponent, { panelClass: 'overlay-wide' }).afterClosed();
      case 'edit':
        return this.dialog.open(
          StudentFormComponent, {
          panelClass: 'overlay-wide',
          data: { student }
        })
          .afterClosed();
    }
  }

}