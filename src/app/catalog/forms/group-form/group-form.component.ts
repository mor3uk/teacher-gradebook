import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Student } from '../../../shared/models/student.model';
import { StudentService } from '../../../shared/services/student.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  students: Student[] = [];
  pickedStudents: Student[] = [];
  selectedStudent: Student = null;
  editMode: boolean = false;

  constructor(
    private ss: StudentService,
    private dialogRef: MatDialogRef<GroupFormComponent>,
  ) { }

  ngOnInit() {
    this.ss.getStudents().then(students => {
      this.students = students.filter(student => !student.group);
    });
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

  async onSelectStudent(e: Event) {
    this.selectedStudent = await this.ss.getStudent((<HTMLInputElement>e.target).value);
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
