import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatListModule, MatSidenavModule, MatIconModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { NavMenuComponent } from './main/header/nav-menu/nav-menu.component';
import { AccountComponent } from './main/header/account/account.component';
import { SidenavComponent } from './main/sidenav/sidenav.component';
import { MainComponent } from './main/main.component';
import { StudentFormComponent } from './catalog/students/student-form/student-form.component';
import { RelativeFormComponent } from './catalog/students/relative-form/relative-form.component';
import { GroupFormComponent } from './catalog/groups/group-form/group-form.component';
import { AddLessonComponent } from './lessons/add-lesson/add-lesson.component';
import { StudentsModule } from './catalog/students/students.module';
import { GroupsModule } from './catalog/groups/groups.module';
import { LessonsModule } from './lessons/lessons.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    AccountComponent,
    SidenavComponent,
    HeaderComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentsModule,
    GroupsModule,
    LessonsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  entryComponents: [
    StudentFormComponent,
    RelativeFormComponent,
    GroupFormComponent,
    AddLessonComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
