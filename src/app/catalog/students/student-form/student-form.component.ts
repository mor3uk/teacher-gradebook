import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import * as moment from 'moment';
import { Moment } from 'moment';

import { Student } from '../../../shared/models/student.model';
import { RelativeFormComponent } from '../relative-form/relative-form.component';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  maxDate: Moment;
  birthDate: Moment;
  student: {
    name?: string;
    surname?: string;
    fatherName?: string;
    group?: string | number;
    birthDate?: number;
  } = {};

  relatives: {
    name: string;
    surname: string;
    fatherName?: string;
    kind: string;
    birthDate: number;
  }[] = [
      {
        name: 'Наталья',
        surname: 'Шурыгина',
        fatherName: 'Павловна',
        kind: 'Мать',
        birthDate: +moment().subtract(44, 'years'),
      },
      {
        name: 'Олег',
        surname: 'Шурыгин',
        fatherName: 'Борисович',
        kind: 'Отец',
        birthDate: +moment().subtract(47, 'years'),
      }
    ];

  constructor(
    private dialogRef: MatDialogRef<StudentFormComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.maxDate = moment().subtract(6, 'years');
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(e) {
    e.preventDefault();
    this.student.birthDate = +this.birthDate;
    this.dialogRef.close(this.student);
  }

  onAddRelative() {
    const dialogRef = this.dialog.open(RelativeFormComponent);
    dialogRef.afterClosed().subscribe((relative) => {
      console.log(relative);
      if (relative) {
        this.relatives.push(relative);
      }
    });

  }

}
