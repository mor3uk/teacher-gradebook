import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLessonComponent } from './calendar-lesson.component';

describe('CalendarLessonComponent', () => {
  let component: CalendarLessonComponent;
  let fixture: ComponentFixture<CalendarLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
