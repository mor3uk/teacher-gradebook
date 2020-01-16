import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LessonService } from '../../shared/services/lesson.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() sidenavClosed = new EventEmitter<void>();

  lessonsLoadedSub: Subscription;
  lessonsChangedSub: Subscription;
  lessonsCount: number = null;

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

  onCloseSidenav() {
    this.sidenavClosed.emit();
  }

}
