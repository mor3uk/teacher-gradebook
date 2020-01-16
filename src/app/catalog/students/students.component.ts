import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { FullnamePipe } from '../../shared/pipes/fullname.pipe';
import { StudentService } from '../../shared/services/student.service';
import { GroupService } from '../../shared/services/group.service';
import { Student } from '../../shared/models/student.model';
import { ConfirmDialog } from '../../shared/components/confirm/confirm.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { GroupFormComponent } from '../groups/group-form/group-form.component';

@Component({
  selector: 'app-students',
  styleUrls: ['students.component.scss'],
  templateUrl: 'students.component.html',
})
export class StudentsComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  pending = false;
  studentsSub: Subscription;
  newGroupSub: Subscription;

  constructor(
    private ss: StudentService,
    private gs: GroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fullnamePipe: FullnamePipe
  ) { }

  ngOnInit() {
    this.getStudentsWithPending();
    this.studentsSub = this.ss.studentsChanged
      .subscribe(students => {
        this.students = students;
        this.pending = false;
      });

    this.newGroupSub = this.gs.newGroupToAdd
      .subscribe(() => {
        const dialogRef = this.dialog.open(GroupFormComponent, {
          panelClass: 'overlay-narrow',
          data: { studentMode: true },
        });
        dialogRef.afterClosed().subscribe(async group => {
          if (group) {
            this.gs.newGroupCreated.next(group);
          }
        });
      });
  }

  onAddStudent() {
    this.openDialog('add').subscribe(async (student) => {
      if (student) {
        await this.ss.addStudent(student as Student);
        this.getStudentsWithPending();
      }
    });
  }

  async onEditStudent(id: string) {
    const student = this.students.find(student => student.id === id);
    this.openDialog('edit', student).subscribe(async student => {
      if (student) {
        await this.ss.updateStudent(student);
        this.getStudentsWithPending();
        this.snackBar.open('Учащийся изменён', 'Ок', {
          duration: 2000,
        });
      }
    });
  }

  onDeleteStudent(id: string) {
    this.openDialog('delete').subscribe(async res => {
      if (res) {
        const deletedStudent = await this.ss.deleteStudent(id);
        const fullname = this.fullnamePipe.transform(deletedStudent, 1);
        this.getStudentsWithPending();
        this.snackBar.open(`Учащийся ${fullname} удалён`, 'Ок', {
          duration: 2000,
        });
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

  getStudentsWithPending() {
    this.pending = true;
    this.ss.getStudents();
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
    this.newGroupSub.unsubscribe();
  }

}
