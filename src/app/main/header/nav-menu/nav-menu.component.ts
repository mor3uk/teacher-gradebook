import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LessonService } from '../../../shared/services/lesson.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  lessonsLoadedSub: Subscription;
  lessonsChangedSub: Subscription;
  lessonsCount: number;

  constructor(private ls: LessonService) { }

  ngOnInit() {
    this.lessonsLoadedSub = this.ls.lessonsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }
      const todayLessons = this.ls.getTodayLessons();
      this.lessonsCount = todayLessons.length;
    });
    this.lessonsChangedSub = this.ls.lessonsChanged.subscribe(() => {
      const todayLessons = this.ls.getTodayLessons();
      this.lessonsCount = todayLessons.length;
    });
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
    this.lessonsChangedSub.unsubscribe();
  }

}
