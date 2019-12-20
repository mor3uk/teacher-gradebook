import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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
  kindList = Object.values(RelativeKind);

  relative: Relative
  relativeForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<RelativeFormComponent>) { }

  ngOnInit() {
    this.relativeForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      surname: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      fatherName: new FormControl(null, [Validators.maxLength(30)]),
      birthDate: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/)]),
      kind: new FormControl(null, [Validators.required, this.kindValidator]),
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
        birthDate: +this.relativeForm.value.birthDate,
      }
      this.dialogRef.close(this.relative);

      console.log(this.relativeForm);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
