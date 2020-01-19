import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import '@progress/kendo-angular-intl/locales/ru/all';

import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarDayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SchedulerModule,
    BrowserAnimationsModule,
    DateInputsModule,
  ],
  exports: [],
  providers: [{
    provide: LOCALE_ID, useValue: 'ru',
  }],
})
export class CalendarModule { }
