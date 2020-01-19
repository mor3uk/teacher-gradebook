import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { CalendarService } from './calendar.service';
import { DayEvent, LessonEvent } from './event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  pending: boolean;
  selectedDate = new Date();
  lessonsLoadedSub: Subscription;
  view = 'month';

  startWork = '7:00';
  endWork = '18:00';

  events = [];
  dayEvents: DayEvent[] = [];
  lessonEvents: LessonEvent[] = [];

  constructor(
    private ls: LessonService,
    private cs: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pending = true;
    this.lessonsLoadedSub = this.ls.lessonsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }

      this.dayEvents = this.cs.getDayEvents();
      this.lessonEvents = this.cs.getLessonEvents();
      this.events = this.dayEvents;

      const bounds = this.cs.getWorkBounds();
      this.startWork = bounds.start + ':00';
      this.endWork = bounds.end + ':00';

      this.pending = false;
    });
  }

  onClickSlot(e) {
    if (this.view === 'month') {
      console.log(e);
      const date = moment(+e.start);
      const year = date.year();
      const month = date.month();
      const day = date.date();

      this.router.navigate([year, month, day], { relativeTo: this.route });
    }
  }

  onEventClick(e) {
    if (this.view === 'week') {
      this.router.navigate(['/lessons', e.event.dataItem.lessonId]);
    }
  }

  getEventClass() {
    let className = 'event';
    if (this.view === 'month') {
      className += ' event_month';
    }

    return className;
  }

  getSlotClass(e) {
    let className = '';
    if (this.view === 'month') {
      className += 'slot';
    }
    if (this.isToday(+e.start)) {
      className += ' today';
    }

    return className;
  }

  onChangeView(e) {
    if (!e.action.view) {
      return;
    }
    this.view = e.action.view.name;
    if (this.view === 'month') {
      this.events = this.dayEvents;
    } else {
      this.events = this.lessonEvents;
    }
  }

  private isToday(ms: number) {
    const ms1 = +moment().startOf('day');
    const ms2 = +moment(ms).startOf('day');
    return ms1 === ms2;
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
  }

}
