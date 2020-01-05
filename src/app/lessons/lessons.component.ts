import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { LessonService } from '../shared/services/lesson.service';
import { Lesson } from '../shared/models/lesson.model';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  lessons: Lesson[] = [];

  constructor(
    private dialog: MatDialog,
    private ls: LessonService,
  ) { }

  async ngOnInit() {
    this.lessons = await this.ls.getTodayLessons();
  }

  onAddLesson() {
    this.dialog.open(AddLessonComponent, { panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(async lesson => {
        if (lesson) {
          console.log(lesson);
          await this.ls.addLesson(lesson);
          this.lessons = await this.ls.getTodayLessons();
        }
      });
  }

}
