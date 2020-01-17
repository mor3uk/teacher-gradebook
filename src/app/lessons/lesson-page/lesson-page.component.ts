import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { StudentService } from '../../shared/services/student.service';
import { GroupService } from '../../shared/services/group.service';
import { Student } from '../../shared/models/student.model';
import { Lesson, CommonLesson } from '../../shared/models/lesson.model';
import { StudentInfoComponent } from './student-info/student-info.component';
import { AddStudentComponent } from './add-student/add-student.component';

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
    private gs: GroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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

        if (this.lesson.studentsMarked) {
          return;
        }
        this.ss.markStudents(this.students);
        this.lesson.studentsMarked = true;
        this.ls.updateLesson(this.lesson);
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

  onShowStudentInfo(student: Student) {
    this.dialog.open(StudentInfoComponent,
      { data: { student, lessonKind: this.lesson.kind }, panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(async res => {
        if (!res) {
          return;
        }
        this.pending = true;

        this.ls.removeStudentFromLessons([this.lesson.id], student.id);
        this.ss.removeLessonFromStudents([student.id], this.lesson.id);

        if (this.lesson.kind === 'common') {
          this.gs.replaceStudent((this.lesson as CommonLesson).groupId, null, student.id);
          this.ss.unsetStudentsGroup([student.id]);
        }

        this.getStudentsAfterChange();
        this.snackBar.open('Учащийся был удалён', 'Ок', {
          duration: 2000,
        });
      });
  }

  onAddStudents() {
    const studentsIdList = this.lesson.studentsInfo.map(info => info.id);
    this.dialog.open(AddStudentComponent,
      { data: { lessonKind: this.lesson.kind, studentsIdList }, panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(async students => {
        if (!students) {
          return;
        }
        this.pending = true;

        this.ss.markStudents(students);
        const studentIdList = students.map(student => student.id);

        this.ls.addStudentsToLesson(this.lesson.id, studentIdList);
        this.ss.addLessonToStudents(studentIdList, this.lesson.id);

        if (this.lesson.kind === 'common') {
          students.forEach(student => {
            this.gs.replaceStudent(null, (this.lesson as CommonLesson).groupId, student.id);
          });
          const group = this.gs.getGroup((this.lesson as CommonLesson).groupId);
          await this.ss.setStudentsGroup(group);
        }

        this.getStudentsAfterChange();
        this.snackBar.open('Учащиеся были добавлены', 'Ок', {
          duration: 2000,
        });
      });
  }

  private getStudentsAfterChange() {
    this.lesson = this.ls.getLesson(this.lesson.id);
    const studentsIdList = this.lesson.studentsInfo.map(info => info.id);
    this.students = this.ss.getStudentsByIdList(studentsIdList);
    this.pending = false;
  }

  getStudentMark(id: string): number {
    const studentInfo = this.lesson.studentsInfo.find(info => info.id === id);
    const mark = studentInfo.mark;
    return mark;
  }

  getStudentBehavior(id: string): number {
    const studentInfo = this.lesson.studentsInfo.find(info => info.id === id);
    const behavior = studentInfo.behavior;
    return behavior;
  }

  studentAttended(id: string): boolean {
    const studentInfo = this.lesson.studentsInfo.find(info => info.id === id);
    const attended = studentInfo.attended;
    return !!attended;
  }

  onChangeAttendance(attended: boolean, studentId: string) {
    this.lesson.studentsInfo.forEach(info => {
      if (info.id === studentId) {
        info.attended = attended;
      }
    });
    this.ls.updateLesson(this.lesson, true);
    const student = this.students.find(student => studentId === student.id);
    if (!student.visitedLessons) {
      student.visitedLessons = 0;
    }
    if (attended) {
      student.visitedLessons++;
    } else {
      student.visitedLessons--;
    }
    this.ss.updateStudent(student, false);
  }

  changeStudentBehavior({ value }, studentId: string) {
    this.lesson.studentsInfo.forEach(info => {
      if (studentId === info.id) {
        info.behavior = value;
      }
    });
    this.ls.updateLesson(this.lesson);
  }

  changeStudentMark({ value }, studentId: string) {
    this.lesson.studentsInfo.forEach(info => {
      if (studentId === info.id) {
        info.mark = value;
      }
    });
    this.ls.updateLesson(this.lesson);
  }

}
