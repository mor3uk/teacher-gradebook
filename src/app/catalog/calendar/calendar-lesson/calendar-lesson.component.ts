import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import * as moment from 'moment';

import { Lesson, CommonLesson } from '../../../shared/models/lesson.model';
import { StudentService } from '../../../shared/services/student.service';
import { Student } from '../../../shared/models/student.model';
import { ConfirmDialog } from '../../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-calendar-lesson',
  templateUrl: './calendar-lesson.component.html',
  styleUrls: ['./calendar-lesson.component.scss']
})
export class CalendarLessonComponent implements OnInit {
  @Input() lesson: Lesson;
  @Output() lessonToDelete = new EventEmitter<string>();
  @Output() lessonToCopy = new EventEmitter<string>();
  @Output() lessonToMove = new EventEmitter<string>();

  students: Student[] = [];
  groupId: string;

  constructor(
    private ss: StudentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    if (this.lesson.kind === 'personal') {
      const studentsIdList = this.lesson.studentsInfo.map(info => info.id);
      this.students = this.ss.getStudentsByIdList(studentsIdList);
    } else {
      this.groupId = (this.lesson as CommonLesson).groupId;
    }
  }

  onDeleteLesson() {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(res => {
      if (res) {
        this.lessonToDelete.emit(this.lesson.id);
      }
    });
  }

  onCopyLesson() {
    this.lessonToCopy.emit(this.lesson.id);
  }

  onMoveLesson() {
    if (this.lesson.startTime < +moment()) {
      this.snackBar.open('Занятие уже началось', 'Ок', { duration: 2000 });
    } else {
      this.lessonToMove.emit(this.lesson.id);
    }
  }

}
