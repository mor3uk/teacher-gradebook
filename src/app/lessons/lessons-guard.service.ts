import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { LessonService } from '../shared/services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsGuard implements CanActivate {
  constructor(
    private ls: LessonService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const lessonId = route.params.id;

    return this.ls.lessonsLoaded.pipe(map(loaded => {
      if (!loaded) {
        this.router.navigate(['lessons']);
        return false;
      }
      const lesson = this.ls.getLesson(lessonId);

      return !!lesson;
    }));
  }
}
