import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import '@progress/kendo-angular-intl/locales/ru/all';

import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { CalendarLessonComponent } from './calendar-lesson/calendar-lesson.component';
import { CalendarDateComponent } from './calendar-date/calendar-date.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarDayComponent,
    CalendarLessonComponent,
    CalendarDateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SchedulerModule,
    BrowserAnimationsModule,
    DateInputsModule,
  ],
  entryComponents: [
    CalendarDateComponent,
    CalendarDayComponent,
  ],
  exports: [],
  providers: [{
    provide: LOCALE_ID, useValue: 'ru',
  }],
})
export class CalendarModule { }
