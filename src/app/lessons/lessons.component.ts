import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
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
  lessonsLoadedSub: Subscription;
  lessonsChangedSub: Subscription;
  pending = false;

  constructor(
    private dialog: MatDialog,
    private ls: LessonService,
    private route: ActivatedRoute,
    private router: Router,
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
          await this.ls.addLesson(lesson);
          this.ls.getLessons();
        }
      });
  }

  onOpenLesson(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
    this.lessonsChangedSub.unsubscribe();
  }

}
