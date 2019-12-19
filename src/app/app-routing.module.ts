import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { ReportsComponent } from './reports/reports.component';
import { LessonsComponent } from './lessons/lessons.component';
import { GroupsComponent } from './catalog/groups/groups.component';
import { StudentsComponent } from './catalog/students/students.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      { path: 'lessons', component: LessonsComponent },
      { path: 'reports', component: ReportsComponent },
      {
        path: 'catalog', children: [
          { path: '', redirectTo: 'groups', pathMatch: 'full' },
          { path: 'groups', component: GroupsComponent },
          { path: 'students', component: StudentsComponent },
        ]
      },
    ]
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
