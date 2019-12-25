import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Student } from '../../../shared/models/student.model';
import { StudentService } from '../../../shared/services/student.service';
import { Group } from '../../../shared/models/group.model';
import { StudentFormComponent } from '../student-form/student-form.component';
import { GroupService } from '../../../shared/services/group.service';
import { groupNameTakedValidator } from './group-form.validator';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  groupForm: FormGroup;

  students: Student[] = [];
  pickedStudents: Student[] = [];
  selectedStudent: Student = null;
  editMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private gs: GroupService,
    private ss: StudentService,
    private dialogRef: MatDialogRef<GroupFormComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.data && this.data.group) {
      this.editMode = true;
      this.ss.getStudents().then(students => {
        this.pickedStudents = students.filter(student => student.groupId === this.data.group.id);
      });
    }

    this.ss.getStudents().then(students => {
      this.students = students.filter(student => !student.groupId);
    });

    this.groupForm = new FormGroup({
      name: new FormControl(
        this.editMode ? this.data.group.name : null,
        [Validators.required, Validators.maxLength(30)],
        [groupNameTakedValidator.bind(this)],
      )
    });
  }

  onSubmit() {
    this.groupForm.markAllAsTouched();
    if (this.groupForm.invalid) {
      return;
    }

    if (this.editMode) {
      this.ss.unsetStudentsGroup(this.students.map(student => student.id));
    }

    const group: Group = {
      id: this.editMode ? this.data.group.id : null,
      name: this.groupForm.controls.name.value,
      studentIdList: this.pickedStudents.map(student => student.id),
    };

    this.dialogRef.close(group);
  }

  onDeleteStudent(id: string) {
    this.pickedStudents = this.pickedStudents.filter(student => {
      if (student.id !== id) {
        return true;
      }
      this.students.push(student);
      return false;
    });
  }

  onSelectStudent(e: Event) {
    this.selectedStudent = this.students
      .find(student => student.id === (<HTMLInputElement>e.target).value);
    (<HTMLInputElement>e.target).value = '';
  }

  onPickStudent() {
    this.students = this.students.filter(student => {
      if (student.id !== this.selectedStudent.id) {
        return true;
      }
      this.pickedStudents.push(this.selectedStudent);
      return false;
    });
    this.selectedStudent = null;
  }

  onPickAll() {
    this.pickedStudents = [...this.students, ...this.pickedStudents];
    this.students = [];
  }

  onCancel() {
    this.dialogRef.close();
  }

  onUnselectStudent() {
    this.selectedStudent = null;
  }

  onAddNewStudent() {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      panelClass: 'overlay-wide',
      data: { groupMode: true },
    });

    dialogRef.afterClosed().subscribe(async student => {
      if (!student) {
        return;
      }
      await this.ss.addStudent(student);
      if (student.groupId === null || (this.editMode && this.data.group.id === student.groupId)) {
        const recentStudent = await this.ss.findExistingStudent(student);
        this.pickedStudents.push(recentStudent);
      }
    });
  }

}
