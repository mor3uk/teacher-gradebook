import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';

import * as moment from 'moment';
import uuid from 'uuid';
import { Moment } from 'moment';

import { Student } from '../../../shared/models/student.model';
import { Relative, RelativeKind } from '../../../shared/models/relative.model';
import { RelativeFormComponent } from '../relative-form/relative-form.component';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  maxDate: Moment = moment().subtract(6, 'years').add(1, 'day');
  submissionTriggered: boolean = false;

  studentForm: FormGroup;
  student: Student;

  relatives: Relative[] = [];

  constructor(
    private dialogRef: MatDialogRef<StudentFormComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.studentForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      surname: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      fatherName: new FormControl(null, Validators.maxLength(30)),
      group: new FormControl(null, [Validators.maxLength(30)]),
      birthDate: new FormControl(null, [Validators.required]),
    }, { validators: this.parentsValidator.bind(this) });
  }

  parentsValidator(): ValidationErrors | null {
    const parentsMatch = this.relatives.find((relative) => {
      return relative.kind === RelativeKind.MOTHER
        || relative.kind === RelativeKind.FATHER
    });

    return parentsMatch ? null : { parentRequired: true };
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(e) {
    e.preventDefault();
    this.submissionTriggered = true;
    this.studentForm.markAllAsTouched();

    if (this.studentForm.valid) {
      this.student = {
        ...this.studentForm.value,
        birthDate: +this.studentForm.value.birthDate,
        relatives: this.relatives,
      };

      this.dialogRef.close(this.student);
      
      console.log(this.studentForm);
    }


  }

  onAddRelative() {
    const dialogRef = this.dialog.open(RelativeFormComponent);
    dialogRef.afterClosed().subscribe((relative) => {
      if (relative) {
        relative.id = uuid();
        this.relatives.push(relative);
        this.studentForm.updateValueAndValidity();
      }
    });

  }

}
