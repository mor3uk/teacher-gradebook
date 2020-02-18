import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTooltipModule, MatSnackBarModule } from '@angular/material';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import {
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl,
  OwlDateTimeModule
} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
import { MaterialModule } from '../material.module';
import { AgePipe } from './pipes/age.pipe';
import { BitrhDatePipe } from './pipes/birth-date.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { ConfirmDialog } from './components/confirm/confirm.component';
import { StudentPickerComponent } from './components/student-picker/student-picker.component';
import { AttendancePipe } from './pipes/attendance.pipe';
import { TimePipe } from './pipes/time.pipe';
import { AddLessonComponent } from './components/add-lesson/add-lesson.component';
import { StudentInfoComponent } from './components/student-info/student-info.component';


const sharedComponentsAndPipes = [
  AgePipe,
  BitrhDatePipe,
  FullnamePipe,
  PluralPipe,
  ConfirmDialog,
  StudentPickerComponent,
  AttendancePipe,
  TimePipe,
  StudentInfoComponent,
  AddLessonComponent,
];

const sharedModules = [
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MaterialModule,
  NgxTrimDirectiveModule,
  MatTooltipModule,
  MatSnackBarModule,
  ReactiveFormsModule,
];

class DefaultIntl extends OwlDateTimeIntl {
  cancelBtnLabel = 'Закрыть';
  setBtnLabel = 'Установить';
}

@NgModule({
  declarations: sharedComponentsAndPipes,
  imports: sharedModules,
  entryComponents: [
    ConfirmDialog,
    StudentInfoComponent,
    AddLessonComponent,
  ],
  exports: [...sharedComponentsAndPipes, ...sharedModules],
  providers: [
    FullnamePipe,
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['LL', 'L', 'l'],
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'LL',
        },
      },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ru',
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: {
        parseInput: 'D MMMM в HH:mm',
        fullPickerInput: 'D MMMM в HH:mm',
        monthYearLabel: 'D MMMM в HH:mm',
      },
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useValue: 'ru',
    },
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl,
    },
  ]
})
export class SharedModule { }
