import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavMenuComponent } from './header/nav-menu/nav-menu.component';
import { AccountComponent } from './header/account/account.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { GroupsComponent } from './catalog/groups/groups.component';
import { LessonComponent } from './lessons/lesson/lesson.component';
import { StudentsComponent } from './catalog/students/students.component';
import { TrancatePipe } from './shared/pipes/trancate.pipe';
import { AgePipe } from './shared/pipes/age.pipe';
import { AttendancePipe } from './shared/pipes/attendance.pipe';
import { FullnamePipe } from './shared/pipes/fullname.pipe';
import { GroupPipe } from './shared/pipes/group.pipe';
import { ConfirmDialog } from './shared/modals/confirm.component';
import { StudentFormComponent } from './catalog/forms/student-form/student-form.component';
import { RelativeFormComponent } from './catalog/forms/relative-form/relative-form.component';
import { PluralPipe } from './shared/pipes/plural.pipe';
import { GroupFormComponent } from './catalog/forms/group-form/group-form.component';
import { BitrhDatePipe } from './shared/pipes/birth-date.pipe';
import { StudentPickerComponent } from './shared/components/student-picker/student-picker.component';
import { AddLessonComponent } from './lessons/add-lesson/add-lesson.component';
import {
  OWL_DATE_TIME_LOCALE,
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeIntl,
  OwlDateTimeModule,
} from 'ng-pick-datetime';

import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';

class DefaultIntl extends OwlDateTimeIntl {
  cancelBtnLabel = 'Закрыть';
  setBtnLabel = 'Установить';
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavMenuComponent,
    AccountComponent,
    SidenavComponent,
    LessonsComponent,
    ReportsComponent,
    AuthComponent,
    MainComponent,
    GroupsComponent,
    LessonComponent,
    StudentsComponent,
    ConfirmDialog,
    StudentFormComponent,
    TrancatePipe,
    AgePipe,
    AttendancePipe,
    FullnamePipe,
    GroupPipe,
    PluralPipe,
    RelativeFormComponent,
    GroupFormComponent,
    BitrhDatePipe,
    StudentPickerComponent,
    AddLessonComponent,
  ],
  imports: [
    MaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
  ],
  entryComponents: [
    ConfirmDialog,
    StudentFormComponent,
    RelativeFormComponent,
    GroupFormComponent,
    AddLessonComponent,
  ],
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
