import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { LessonService } from '../shared/services/lesson.service';
import { StudentService } from '../shared/services/student.service';
import { Lesson } from '../shared/models/lesson.model';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { ConfirmDialog } from '../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  lessonsLoadedSub: Subscription;
  lessonsChangedSub: Subscription;
  pending = false;

  constructor(
    private dialog: MatDialog,
    private ls: LessonService,
    private ss: StudentService
  ) { }

  ngOnInit() {
    this.pending = true;
    this.lessonsLoadedSub = this.ls.lessonsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }
      this.lessons = this.ls.getTodayLessons();
      this.pending = false;
    });
    this.lessonsChangedSub = this.ls.lessonsChanged.subscribe(() => {
      this.lessons = this.ls.getTodayLessons();
      this.pending = false;
    });
  }

  onAddLesson() {
    this.dialog.open(AddLessonComponent, { panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(async lesson => {
        if (lesson) {
          this.pending = true;
          const newLesson = await this.ls.addLesson(lesson);
          const idList = newLesson.studentsInfo.map(info => info.id);
          await this.ss.addLessonToStudents(idList, newLesson.id);
          this.ls.getLessons();
        }
      });
  }

  async onDeleteLesson(id: string) {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(async res => {
      if (res) {
        this.pending = true;
        const lesson = await this.ls.deleteLesson(id);
        const studentsIdList = lesson.studentsInfo.map(info => info.id);
        this.ss.removeLessonFromStudents(studentsIdList, lesson.id);
        this.ls.getLessons();
      }
    });
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
    this.lessonsChangedSub.unsubscribe();
  }

}
