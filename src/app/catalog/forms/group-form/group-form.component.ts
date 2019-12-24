import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Student } from '../../../shared/models/student.model';
import { StudentService } from '../../../shared/services/student.service';
import { Group } from '../../../shared/models/group.model';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  name: string;

  students: Student[] = [];
  pickedStudents: Student[] = [];
  selectedStudent: Student = null;
  editMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private ss: StudentService,
    private dialogRef: MatDialogRef<GroupFormComponent>,
  ) { }

  ngOnInit() {
    if (this.data && this.data.group) {
      this.editMode = true;
      this.name = this.data.group.name;
      this.ss.getStudents().then(students => {
        this.pickedStudents = students.filter(student => student.group === this.data.group.id);
      });
    }
    this.ss.getStudents().then(students => {
      this.students = students.filter(student => !student.group);
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.ss.unsetStudentsGroup(this.students.map(student => student.id));
    }

    const group: Group = {
      id: this.editMode ? this.data.group.id : null,
      name: this.name,
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

  onCancel() {
    this.dialogRef.close();
  }

  onUnselectStudent() {
    this.selectedStudent = null;
  }

  onEditStudent(id: string) {
    alert('edit ' + id);
  }

}
