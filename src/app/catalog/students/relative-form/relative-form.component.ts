import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Moment } from 'moment';

@Component({
  selector: 'app-relative-form',
  templateUrl: './relative-form.component.html',
  styleUrls: ['./relative-form.component.scss']
})
export class RelativeFormComponent implements OnInit {
  relative: {
    name?: string,
    surname?: string,
    fatherName?: string,
    kind?: string,
    birthDate?: number,
  } = {};
  birthDate: Moment;


  constructor(private dialogRef: MatDialogRef<RelativeFormComponent>) { }

  ngOnInit() {
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.birthDate);
    this.relative.birthDate = +this.birthDate;
    this.dialogRef.close(this.relative);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
