import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LessonsComponent } from './lessons.component';
import { LessonComponent } from './lesson/lesson.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { TimePipe } from '../shared/pipes/time.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LessonsComponent,
    LessonComponent,
    AddLessonComponent,
    TimePipe,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [],
  providers: [],
})
export class LessonsModule { }
