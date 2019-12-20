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
import { CommonLessonComponent } from './lessons/common-lesson/common-lesson.component';
import { StudentsComponent } from './catalog/students/students.component';
import { TrancatePipe } from './shared/pipes/trancate.pipe';
import { AgePipe } from './shared/pipes/age.pipe';
import { AttendancePipe } from './shared/pipes/attendance.pipe';
import { FullnamePipe } from './shared/pipes/fullname.pipe';
import { GroupPipe } from './shared/pipes/group.pipe';
import { ConfirmDialog } from './shared/modals/confirm.component';
import { StudentFormComponent } from './catalog/students/student-form/student-form.component';
import { RelativeFormComponent } from './catalog/students/relative-form/relative-form.component';

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
    CommonLessonComponent,
    StudentsComponent,
    ConfirmDialog,
    StudentFormComponent,
    TrancatePipe,
    AgePipe,
    AttendancePipe,
    FullnamePipe,
    GroupPipe,
    RelativeFormComponent,
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
  ],
  entryComponents: [
    ConfirmDialog,
    StudentFormComponent,
    RelativeFormComponent,
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
        },
      },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ru',
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
