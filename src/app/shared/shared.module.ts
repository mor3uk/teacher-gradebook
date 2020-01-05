import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import {
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl,
  OwlDateTimeModule
} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
import { AgePipe } from './pipes/age.pipe';
import { BitrhDatePipe } from './pipes/birth-date.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { GroupPipe } from './pipes/group.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { TrancatePipe } from './pipes/trancate.pipe';
import { ConfirmDialog } from './components/confirm/confirm.component';
import { MaterialModule } from '../material.module';
import { StudentPickerComponent } from './components/student-picker/student-picker.component';


const sharedComponentsAndPipes = [
  AgePipe,
  BitrhDatePipe,
  FullnamePipe,
  GroupPipe,
  PluralPipe,
  TrancatePipe,
  ConfirmDialog,
  StudentPickerComponent,
];

const sharedModules = [
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MaterialModule,
  NgxTrimDirectiveModule,
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
  ],
  exports: [...sharedComponentsAndPipes, ...sharedModules],
  providers: [
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
