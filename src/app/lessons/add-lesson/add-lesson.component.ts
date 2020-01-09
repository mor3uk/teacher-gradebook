import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';

import { GroupService } from '../../shared/services/group.service';
import { StudentService } from '../../shared/services/student.service';
import { Group } from '../../shared/models/group.model';
import { CommonLesson, Lesson, PersonalLesson } from '../../shared/models/lesson.model';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent implements OnInit, OnDestroy {
  lessonKind: 'common' | 'personal' = 'common';
  groups: Group[] = [];
  group: Group;
  lessonForm: FormGroup;
  minTime: Moment = moment().add('1', 'hour');
  studentsSub: Subscription;

  students: Student[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddLessonComponent>,
    private gs: GroupService,
    private ss: StudentService,
  ) { }

  async ngOnInit() {
    this.ss.getStudents();

    this.lessonForm = new FormGroup({
      startTime: new FormControl(null, [Validators.required]),
      durationMinutes: new FormControl(null, [Validators.required]),
      pickedGroup: new FormControl(null),
    });

    this.studentsSub = this.ss.studentsChanged
      .subscribe(students => {
        this.students = students;
      });

    this.gs.groupsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }
      this.groups = this.gs.getGroupsWithStudents();
    });
  }

  onPickGroup(e: Event) {
    const id = (e.target as HTMLInputElement).value;
    (e.target as HTMLInputElement).value = '';
    this.lessonForm.controls.pickedGroup.setValue(this.groups.find(group => group.id === id));
  }

  onUnpickGroup() {
    this.lessonForm.controls.pickedGroup.setValue(null);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }

    let lesson: Lesson;

    if (this.lessonKind === 'common') {
      lesson = this.createCommonLesson();
    }
    if (this.lessonKind === 'personal') {
      lesson = this.createPersonalLesson();
    }

    this.dialogRef.close({ ...lesson });
  }

  createPersonalLesson(): PersonalLesson {
    const studentsInfo = this.lessonForm.controls.pickedStudents.value.map(student => ({ id: student.id }));
    const personalLesson: PersonalLesson = {
      kind: 'personal',
      price: +this.lessonForm.controls.price.value,
      durationMinutes: +this.lessonForm.controls.durationMinutes.value,
      startTime: +this.lessonForm.controls.startTime.value,
      studentsInfo,
    };

    return personalLesson;
  }

  createCommonLesson(): CommonLesson {
    const studentsInfo = this.lessonForm.controls.pickedGroup.value.studentIdList.map(id => ({ id }));
    const commonLesson: CommonLesson = {
      kind: 'common',
      durationMinutes: +this.lessonForm.controls.durationMinutes.value,
      startTime: +this.lessonForm.controls.startTime.value,
      studentsInfo,
      groupId: this.lessonForm.controls.pickedGroup.value.id,
    };

    return commonLesson;
  }

  onChangeKind(kind: string) {
    this.lessonKind = (kind as 'common' | 'personal');

    if (this.lessonKind === 'personal') {
      this.lessonForm.removeControl('pickedGroup');
      this.lessonForm.addControl('pickedStudents', new FormControl([]));
      this.lessonForm.addControl('price', new FormControl(null, [Validators.required]));
    }
    if (this.lessonKind === 'common') {
      this.lessonForm.addControl('pickedGroup', new FormControl(null));
      this.lessonForm.removeControl('price');
      this.lessonForm.removeControl('pickedStudents');
    }
  }

  onPickStudents(studentsData: any) {
    this.lessonForm.controls.pickedStudents.setValue(
      studentsData.pickedStudents.map(student => ({ id: student.id }))
    );
  }

  ngOnDestroy() {
    if (this.studentsSub) {
      this.studentsSub.unsubscribe();
    }
  }

}
