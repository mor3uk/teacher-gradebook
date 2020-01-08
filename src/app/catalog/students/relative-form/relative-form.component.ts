import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

import { Moment } from 'moment';
import * as moment from 'moment';

import { Relative, RelativeKind } from '../../../shared/models/relative.model';

@Component({
  selector: 'app-relative-form',
  templateUrl: './relative-form.component.html',
  styleUrls: ['./relative-form.component.scss']
})
export class RelativeFormComponent implements OnInit {
  maxDate: Moment = moment().subtract(16, 'years').add(1, 'day');
  kindList: RelativeKind[];
  editMode = false;

  relative: Relative;
  relativeForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RelativeFormComponent>,
  ) { }

  ngOnInit() {
    if (this.data.relative) {
      this.editMode = true;
    }

    this.kindList = this.data.leftRelatives;

    this.relativeForm = new FormGroup({
      name: new FormControl(
        this.editMode ? this.data.relative.name : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      surname: new FormControl(
        this.editMode ? this.data.relative.surname : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      fatherName: new FormControl(
        this.editMode ? this.data.relative.fatherName : null,
        [Validators.maxLength(30)]
      ),
      number: new FormControl(
        this.editMode ? this.data.relative.number : null,
        [Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/)]
      ),
      kind: new FormControl(
        this.editMode ? this.data.relative.kind : null,
        [Validators.required, this.kindValidator]
      ),
    });
  }

  kindValidator(control: AbstractControl): ValidationErrors | null {
    if (!Object.values(RelativeKind).includes(control.value)) {
      return { unknownRelative: true };
    }
    return null;
  }

  onSubmit(e) {
    e.preventDefault();
    this.relativeForm.markAllAsTouched();

    if (this.relativeForm.valid) {
      this.relative = {
        ...this.relativeForm.value,
      };

      if (this.editMode) {
        this.relative.id = this.data.relative.id;
      }

      this.dialogRef.close(this.relative);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
