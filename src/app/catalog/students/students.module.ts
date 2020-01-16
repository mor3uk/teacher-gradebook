import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../../shared/shared.module';
import { StudentFormComponent } from './student-form/student-form.component';
import { RelativeFormComponent } from './relative-form/relative-form.component';
import { StudentsComponent } from './students.component';

@NgModule({
  declarations: [
    RelativeFormComponent,
    StudentsComponent,
    StudentFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  exports: [
    FlexLayoutModule,
  ],
})
export class StudentsModule { }
