import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { Student } from '../../models/student.model';
import { ConfirmDialog } from '../confirm/confirm.component';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss']
})
export class StudentInfoComponent implements OnInit {
  student: Student;
  lessonKind: string;
  enableDeletion: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<StudentInfoComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.student = this.data.student;
    this.lessonKind = this.data.lessonKind;
    this.enableDeletion = this.data.enableDeletion;
  }

  onRemoveStudent() {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(res => {
      if (res && this.enableDeletion) {
        this.dialogRef.close(true);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
