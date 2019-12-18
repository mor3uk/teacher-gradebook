import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    CommonLessonComponent
  ],
  imports: [
    MaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
