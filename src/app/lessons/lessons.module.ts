import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LessonsComponent } from './lessons.component';
import { LessonComponent } from './lesson/lesson.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { TimePipe } from '../shared/pipes/time.pipe';
import { LessonPageComponent } from './lesson-page/lesson-page.component';

@NgModule({
  declarations: [
    LessonsComponent,
    LessonComponent,
    AddLessonComponent,
    TimePipe,
    LessonPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UiSwitchModule,
    FlexLayoutModule,
  ],
  exports: [],
  providers: [],
})
export class LessonsModule { }
