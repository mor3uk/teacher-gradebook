import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { MainComponent } from './main/main.component';
import { LessonsComponent } from './lessons/lessons.component';
import { GroupsComponent } from './catalog/groups/groups.component';
import { StudentsComponent } from './catalog/students/students.component';
import { LessonPageComponent } from './lessons/lesson-page/lesson-page.component';
import { LessonsGuard } from './lessons/lessons-guard.service';
import { CalendarComponent } from './catalog/calendar/calendar.component';
import { CalendarDayComponent } from './catalog/calendar/calendar-day/calendar-day.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      {
        path: 'lessons', children: [
          { path: '', pathMatch: 'full', component: LessonsComponent },
          { path: ':id', component: LessonPageComponent, canActivate: [LessonsGuard] },
        ]
      },
      {
        path: 'catalog', children: [
          { path: '', redirectTo: 'groups', pathMatch: 'full' },
          { path: 'groups', component: GroupsComponent },
          { path: 'students', component: StudentsComponent },
          {
            path: 'calendar', children: [
              { path: '', component: CalendarComponent, pathMatch: 'full' },
              { path: ':years/:months/:date', component: CalendarDayComponent },
            ]
          },
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
