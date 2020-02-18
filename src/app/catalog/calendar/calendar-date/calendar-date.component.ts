import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as moment from 'moment';
import { LessonService } from '../../../shared/services/lesson.service';
import { timeTaken } from '../../../shared/validators/timeTaken.validator';
import { minTime } from '../../../shared/validators/minTime.validator';

@Component({
  selector: 'app-calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.scss']
})
export class CalendarDateComponent implements OnInit {
  dateForm: FormGroup;
  minTime = moment().add(1, 'hour');

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CalendarDateComponent>,
    private ls: LessonService,
  ) { }

  ngOnInit() {
    this.dateForm = new FormGroup({
      startTime: new FormControl(null, [Validators.required, minTime(this.minTime)]),
      durationMinutes: new FormControl(this.data.durationMinutes),
    }, timeTaken(this.ls, this.data));
  }

  onSubmit() {
    if (this.dateForm.invalid) {
      return;
    }
    this.dialogRef.close(this.dateForm.controls.startTime.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
