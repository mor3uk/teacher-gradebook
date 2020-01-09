import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { PersonalLesson, CommonLesson } from '../../shared/models/lesson.model';
import { StudentService } from '../../shared/services/student.service';
import { Student } from '../../shared/models/student.model';
import { GroupService } from 'src/app/shared/services/group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {
  @Input() lesson: CommonLesson | PersonalLesson;
  students: Student[] = [];
  groupId: string = null;
  pending = false;

  studentsLoadedSub: Subscription;
  groupsLoadedSub: Subscription;

  constructor(
    private ss: StudentService,
    private gs: GroupService,
  ) { }

  ngOnInit() {
    this.pending = true;
    if (this.lesson.kind === 'common') {
      this.groupsLoadedSub = this.gs.groupsLoaded.subscribe((loaded) => {
        if (!loaded) {
          return;
        }
        this.groupId = (this.lesson as CommonLesson).groupId;
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


}
