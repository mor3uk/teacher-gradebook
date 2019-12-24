import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import uuid from 'uuid';
import { Moment } from 'moment';

import { GroupService } from '../../../shared/services/group.service';
import { StudentService } from '../../../shared/services/student.service';
import { Group } from '../../../shared/models/group.model';
import { Student } from '../../../shared/models/student.model';
import { Relative, RelativeKind } from '../../../shared/models/relative.model';
import { RelativeFormComponent } from '../relative-form/relative-form.component';
import { existsValidator, parentsValidator, groupExistsValidator } from './student-form.validators';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  maxDate: Moment = moment().subtract(6, 'years').add(1, 'day');
  submissionTriggered: boolean = false;
  editMode: boolean = false;

  studentForm: FormGroup;
  student: Student;

  relatives: Relative[] = [];
  leftRelatives: RelativeKind[] = [];
  groups: Group[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<StudentFormComponent>,
    private dialog: MatDialog,
    private ss: StudentService,
    private gs: GroupService,
  ) { }

  ngOnInit() {
    if (this.data && this.data.student) {
      this.editMode = true;
      this.relatives = this.data.student.relatives;
    }

    this.gs.getGroups().then((groups) => (this.groups = groups));

    this.setLeftRelatives();

    this.studentForm = new FormGroup({
      name: new FormControl(
        this.editMode ? this.data.student.name : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      surname: new FormControl(
        this.editMode ? this.data.student.surname : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      fatherName: new FormControl(
        this.editMode ? this.data.student.fatherName : null,
        Validators.maxLength(30)
      ),
      group: new FormControl(
        this.editMode ? this.data.student.group : null,
        [],
        [groupExistsValidator.bind(this)],
      ),
      birthDate: new FormControl(
        this.editMode ? moment(this.data.student.birthDate) : null,
        [Validators.required]
      ),
    }, {
      validators: [parentsValidator.bind(this)],
      asyncValidators: [existsValidator.bind(this)]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(e) {
    e.preventDefault();
    this.submissionTriggered = true;
    this.studentForm.markAllAsTouched();

    if (this.studentForm.valid) {
      this.student = {
        ...this.studentForm.value,
        birthDate: +this.studentForm.value.birthDate,
        relatives: this.relatives,
        group: this.studentForm.value.group === 'null' ? null : this.studentForm.value.group,
        id: this.editMode && this.data.student.id,
      };

      this.dialogRef.close(this.student);
    }
  }

  onAddRelative() {
    const dialogRef = this.dialog.open(RelativeFormComponent, {
      data: { leftRelatives: this.leftRelatives }
    });

    dialogRef.afterClosed().subscribe((relative) => {
      if (relative) {
        relative.id = uuid();
        this.relatives.push(relative);
        this.studentForm.updateValueAndValidity();
        this.setLeftRelatives();
      }
    });
  }

  onDeleteRelative(id: string) {
    this.relatives = this.relatives.filter(relative => id !== relative.id);
    this.studentForm.updateValueAndValidity();
    this.setLeftRelatives();
  }

  onEditRelative(id: string) {
    const relative = this.relatives.find(relative => relative.id === id);
    const dialogRef = this.dialog.open(RelativeFormComponent, {
      panelClass: 'overlay-wide',
      data: {
        relative,
        leftRelatives: [...this.leftRelatives, relative.kind],
      }
    });

    dialogRef.afterClosed().subscribe((relativeToUpdate) => {
      if (!relativeToUpdate) {
        return;
      }

      this.relatives = this.relatives.map((relative) => {
        return relativeToUpdate.id === relative.id
          ? relativeToUpdate
          : relative;
      });
      this.studentForm.updateValueAndValidity();
      this.setLeftRelatives();
    });
  }

  setLeftRelatives() {
    this.leftRelatives = Object.values(RelativeKind).filter(kind => {
      const existingRelative = this.relatives.find(relative => relative.kind === kind);
      return !existingRelative;
    });
  }

}
