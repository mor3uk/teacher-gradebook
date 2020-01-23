import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { LessonService } from '../../shared/services/lesson.service';
import { CalendarService } from './calendar.service';
import { DayEvent, LessonEvent } from './event.model';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.pending = true;
    this.lessonsLoadedSub = this.ls.lessonsLoaded.subscribe(loaded => {
      if (!loaded) {
        return;
      }

      this.setCalendar();

      this.pending = false;
    });
  }

  onClickSlot(e) {
    if (this.view === 'month') {
      this.dialog.open(CalendarDayComponent, { data: { ts: +e.start }, panelClass: 'calendar-day' })
        .afterClosed()
        .subscribe(async changes => {
          if (!changes) {
            return;
          }
          this.pending = true;

          await this.cs.setUpdates(changes);
          await this.ls.getLessons();

          this.setCalendar();
          this.snackBar.open('Изменения применены', 'Ок', { duration: 2000 });

          this.pending = false;
        });
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
    if (this.cs.isOneDay(+e.start, +moment())) {
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

  private setCalendar() {
    this.dayEvents = this.cs.getDayEvents();
    this.lessonEvents = this.cs.getLessonEvents();
    this.events = this.dayEvents;

    const bounds = this.cs.getWorkBounds();
    this.startWork = bounds.start + ':00';
    this.endWork = bounds.end + ':00';
  }

  ngOnDestroy() {
    this.lessonsLoadedSub.unsubscribe();
  }

}
