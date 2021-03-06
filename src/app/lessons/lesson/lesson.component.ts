import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { StudentService } from '../../shared/services/student.service';
import { GroupService } from '../../shared/services/group.service';
import { LessonService } from '../../shared/services/lesson.service';
import { PersonalLesson, CommonLesson } from '../../shared/models/lesson.model';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {
  @Input() lesson: CommonLesson | PersonalLesson;
  @Output() lessonToDelete = new EventEmitter<string>();

  students: Student[] = [];
  groupId: string = null;
  pending = false;
  groupDeleted: boolean = null;

  studentsLoadedSub: Subscription;
  groupsLoadedSub: Subscription;

  constructor(
    private ss: StudentService,
    private gs: GroupService,
    private ls: LessonService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pending = true;
    if (this.lesson.kind === 'common') {
      this.groupsLoadedSub = this.gs.groupsLoaded.subscribe((loaded) => {
        if (!loaded) {
          return;
        }
        this.groupId = (this.lesson as CommonLesson).groupId;
        const group = this.gs.getGroup(this.groupId);
        if (group) {
          this.groupDeleted = false;
        } else {
          this.groupDeleted = true;
        }
        this.pending = false;
      });
    }

    if (this.lesson.kind === 'personal') {
      this.studentsLoadedSub = this.ss.studentsLoaded.subscribe((loaded) => {
        if (!loaded) {
          return;
        }
        const idList = this.lesson.studentsInfo.map(info => info.id);
        this.students = this.ss.getStudentsByIdList(idList);
        this.pending = false;
      });
    }
  }

  ngOnDestroy() {
    if (this.studentsLoadedSub) {
      this.studentsLoadedSub.unsubscribe();
    }
    if (this.groupsLoadedSub) {
      this.groupsLoadedSub.unsubscribe();
    }
  }

  onOpenLesson() {
    if (this.groupDeleted === true) {
      this.onDeleteLesson();
    } else {
      this.router.navigate([this.lesson.id], { relativeTo: this.route });
    }
  }

  onDeleteLesson() {
    this.lessonToDelete.emit(this.lesson.id);
  }

  getGroupName(id: string) {
    return this.gs.getGroupName(id);
  }

}
