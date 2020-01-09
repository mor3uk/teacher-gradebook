import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { LessonService } from '../shared/services/lesson.service';
import { Lesson } from '../shared/models/lesson.model';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  lessonsSub: Subscription;
  pending = false;

  constructor(
    private dialog: MatDialog,
    private ls: LessonService,
  ) { }

  async ngOnInit() {
    this.pending = true;
    this.ls.getTodayLessons();
    this.lessonsSub = this.ls.todayLessonsChanged
      .subscribe(lessons => {
        this.lessons = lessons;
        this.pending = false;
      });
  }

  onAddLesson() {
    this.dialog.open(AddLessonComponent, { panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(async lesson => {
        if (lesson) {
          console.log(lesson);
          this.pending = true;
          await this.ls.addLesson(lesson);
          this.ls.getTodayLessons();
        }
      });
  }

  ngOnDestroy() {
    this.lessonsSub.unsubscribe();
  }

}
