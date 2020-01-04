import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Student } from '../../../shared/models/student.model';
import { StudentService } from '../../../shared/services/student.service';
import { Group } from '../../../shared/models/group.model';
import { StudentFormComponent } from '../student-form/student-form.component';
import { GroupService } from '../../../shared/services/group.service';
import { groupNameTaken } from './group-form.validator';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  pending = false;
  groupForm: FormGroup;
  students: Student[] = [];
  pickedStudents: Student[] = [];
  editMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gs: GroupService,
    private ss: StudentService,
    private dialogRef: MatDialogRef<GroupFormComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.pending = true;
    if (this.data && this.data.group) {
      this.editMode = true;
      this.ss.getStudentsByGroupId(this.data.group.id)
        .then(students => (this.pickedStudents = students));
    }

    this.ss.getStudents().then(students => {
      this.students = students.filter(student => !student.groupId);
      this.pending = false;
    });

    this.groupForm = new FormGroup({
      name: new FormControl(
        this.editMode ? this.data.group.name : null,
        [Validators.required, Validators.maxLength(30)],
        [groupNameTaken(this.gs, this.editMode, this.data && this.data.group.name)],
      ),
    });
  }

  onSubmit() {
    this.groupForm.markAllAsTouched();
    if (this.groupForm.invalid && !this.pending) {
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

  onPickStudents(students: Student[]) {
    this.pickedStudents = students;
  }

  onCancel() {
    this.dialogRef.close();
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
