import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UiSwitchModule } from 'ngx-ui-switch';

import { SharedModule } from '../shared/shared.module';
import { LessonsComponent } from './lessons.component';
import { LessonComponent } from './lesson/lesson.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { TimePipe } from '../shared/pipes/time.pipe';
import { LessonPageComponent } from './lesson-page/lesson-page.component';
import { StudentInfoComponent } from './lesson-page/student-info/student-info.component';
import { AddStudentComponent } from './lesson-page/add-student/add-student.component';

@NgModule({
  declarations: [
    LessonsComponent,
    LessonComponent,
    AddLessonComponent,
    TimePipe,
    LessonPageComponent,
    StudentInfoComponent,
    AddStudentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UiSwitchModule,
    FlexLayoutModule,
  ],
  entryComponents: [
    StudentInfoComponent,
    AddStudentComponent,
  ],
  exports: [],
  providers: [],
})
export class LessonsModule { }
