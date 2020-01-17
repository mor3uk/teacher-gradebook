import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { StudentService } from '../../../shared/services/student.service';
import { Student } from '../../../shared/models/student.model';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  students: Student[] = [];
  pickedStudents: Student[] = [];
  lessonKind: string;

  constructor(
    private dialogRef: MatDialogRef<AddStudentComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private ss: StudentService,
  ) { }

  ngOnInit() {
    this.lessonKind = this.data.lessonKind;
    let students = [];

    if (this.lessonKind === 'common') {
      students = this.ss.getFreeStudents();
    } else {
      students = this.ss.getCurrentStudents();
    }
    this.students = students.filter(student => !this.data.studentsIdList.includes(student.id));
  }

  onPickStudents({ students, pickedStudents }) {
    this.students = students;
    this.pickedStudents = pickedStudents;
  }

  onAddStudents() {
    this.dialogRef.close(this.pickedStudents);
  }

  onClose() {
    this.dialogRef.close();
  }

}
