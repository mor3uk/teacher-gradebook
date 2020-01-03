import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';

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
export class AddLessonComponent implements OnInit {
  lessonKind: 'common' | 'personal' = 'common';
  groups: Group[] = [];
  lessonForm: FormGroup;
  minTime: Moment = moment().add('1', 'hour');

  students: Student[] = [];
  selectedStudent: Student;


  constructor(
    private dialogRef: MatDialogRef<AddLessonComponent>,
    private gs: GroupService,
    private ss: StudentService,
  ) { }

  async ngOnInit() {
    this.lessonForm = new FormGroup({
      startTime: new FormControl(null, [Validators.required]),
      durationMinutes: new FormControl(null, [Validators.required]),
      pickedGroup: new FormControl(null),
    });
    this.groups = await this.gs.getGroupsWithStudents();
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
    console.log(this.lessonForm);
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

    console.log(lesson);
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

  onChangeKind(e: MatRadioChange) {
    this.lessonKind = (e.value as 'common' | 'personal');

    if (this.lessonKind === 'personal') {
      this.ss.getStudents().then(students => (this.students = students));
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

  onDeleteStudent(id: string) {
    const pickedStudents = this.lessonForm.controls.pickedStudents.value.filter(student => {
      if (student.id !== id) {
        return true;
      }
      this.students.push(student);
      return false;
    });

    this.lessonForm.controls.pickedStudents.setValue(pickedStudents);
  }

  onSelectStudent(id: string) {
    this.selectedStudent = this.students.find(student => student.id === id);
  }

  onPickStudent() {
    this.students = this.students.filter(student => {
      if (student.id !== this.selectedStudent.id) {
        return true;
      }
      this.lessonForm.controls.pickedStudents.value.push(this.selectedStudent);
      return false;
    });
    this.selectedStudent = null;
  }

  onPickAll() {
    this.lessonForm.controls.pickedStudents.setValue(
      [...this.students, ...this.lessonForm.controls.pickedStudents.value]
    );
    this.students = [];
  }

  onUnselectStudent() {
    this.selectedStudent = null;
  }

}
