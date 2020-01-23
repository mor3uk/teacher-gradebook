import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs';
import * as uuid from 'uuid';

import { LessonService } from '../../../shared/services/lesson.service';
import { StudentService } from '../../../shared/services/student.service';
import { CalendarService } from '../calendar.service';
import { Lesson } from '../../../shared/models/lesson.model';
import { Changes } from '../changes.model';
import { AddLessonComponent } from '../../../shared/components/add-lesson/add-lesson.component';
import { CalendarDateComponent } from '../calendar-date/calendar-date.component';
import { ConfirmDialog } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss']
})
export class CalendarDayComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  lessonsToChange: Lesson[] = [];
  pending: boolean;

  changes: Changes = {
    add: [],
    delete: [],
  };

  studentsLoadedSub: Subscription;

  constructor(
    private ls: LessonService,
    private ss: StudentService,
    private cs: CalendarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CalendarDayComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit() {
    this.pending = true;
    this.studentsLoadedSub = this.ss.studentsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }
      this.lessons = this.ls.getDayLessonsByTimestamp(this.data.ts);
      this.lessonsToChange = [...this.lessons];
      this.pending = false;
    });
  }

  onDeleteLesson(id: string) {
    this.lessonsToChange = this.lessonsToChange.filter(lesson => lesson.id !== id);
    this.changes.add = this.changes.add.filter(lesson => lesson.id !== id);
    this.changes.delete.push(id);
  }

  onAddLesson() {
    this.dialog.open(AddLessonComponent,
      { data: { changes: this.changes }, panelClass: 'overlay-narrow' }
    )
      .afterClosed()
      .subscribe(lesson => {
        if (!lesson) {
          return;
        }
        lesson.id = uuid();
        this.lessonsToChange.push(lesson);
        this.lessonsToChange.sort((a, b) => (a.startTime - b.startTime));
        this.changes.add.push(lesson);
      });
  }

  onCopyLesson(id: string) {
    this.openDialog(id).subscribe(time => {
      if (!time) {
        return;
      }
      let lesson = this.ls.getLesson(id);
      if (!lesson) {
        lesson = this.lessonsToChange.find(lesson => lesson.id === id);
      }
      const lessonCopy = this.ls.makeLessonCopy(lesson, +time);

      if (this.cs.isOneDay(lessonCopy.startTime, this.data.ts)) {
        this.lessonsToChange.push(lessonCopy);
      }
      this.changes.add.push(lessonCopy);
    });
  }

  onMoveLesson(id: string) {
    this.openDialog(id).subscribe(time => {
      if (!time) {
        return;
      }

      let lesson = this.ls.getLesson(id);
      if (!lesson) {
        lesson = this.lessonsToChange.find(lesson => lesson.id === id);
      }
      const lessonCopy = this.ls.makeLessonCopy(lesson, +time);

      this.lessonsToChange = this.lessonsToChange.filter(lesson => lesson.id !== id);
      this.changes.delete.push(id);

      if (this.cs.isOneDay(lessonCopy.startTime, this.data.ts)) {
        this.lessonsToChange.push(lessonCopy);
      }
      this.changes.add.push(lessonCopy);
    });
  }

  private openDialog(id: string) {
    const lesson = this.lessonsToChange.find(lesson => lesson.id === id);
    return this.dialog.open(CalendarDateComponent,
      {
        data: {
          changes: this.changes,
          durationMinutes: lesson.durationMinutes
        },
        panelClass: 'overlay-narrow'
      })
      .afterClosed();
  }

  onReset() {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(res => {
      if (res) {
        this.lessonsToChange = [...this.lessons];
        this.changes = { add: [], delete: [] };
        this.snackBar.open('Изменения отменены', 'Ок', { duration: 2000 });
      }
    });
  }

  onResetAndClose() {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }

  onSaveAndClose() {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close(this.changes);
      }
    });
  }

  ngOnDestroy() {
    this.studentsLoadedSub.unsubscribe();
  }

}
