import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { StudentService } from '../../shared/services/student.service';
import { Student } from '../../shared/models/student.model';
import { Lesson, CommonLesson } from '../../shared/models/lesson.model';

@Component({
  selector: 'app-lesson-page',
  templateUrl: './lesson-page.component.html',
  styleUrls: ['./lesson-page.component.scss']
})
export class LessonPageComponent implements OnInit, OnDestroy {
  lesson: Lesson;
  lessonsLoadedSub: Subscription;
  studentsLoadedSub: Subscription;
  students: Student[] = [];
  pending = false;

  constructor(
    private route: ActivatedRoute,
    private ls: LessonService,
    private ss: StudentService,
  ) { }

  ngOnInit() {
    this.pending = true;
    this.route.params.subscribe(params => {
      this.lessonsLoadedSub = this.ls.lessonsLoaded.subscribe(loaded => {
        if (!loaded) {
          return;
        }
        this.lesson = this.ls.getLesson(params.id);
        this.getStudents();
      });
    });
  }

  private getStudents() {
    const studentsIdList = this.lesson.studentsInfo.map(info => info.id);
    this.studentsLoadedSub = this.ss.studentsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }
      if (this.lesson.kind === 'personal') {
        this.students = this.ss.getStudentsByIdList(studentsIdList);
      } else {
        this.students = this.ss.getStudentsByGroupId((this.lesson as CommonLesson).groupId);
        this.ls.checkStudentsCompatibility(this.lesson, this.students);
      }
    });
    this.pending = false;
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
    this.studentsLoadedSub.unsubscribe();
  }

  getLessonTime() {
    moment.locale('ru');
    return moment(this.lesson.startTime)
      .format('DD MMM HH:mm');
  }

}
