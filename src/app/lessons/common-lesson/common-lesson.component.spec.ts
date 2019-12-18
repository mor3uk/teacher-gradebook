import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLessonComponent } from './common-lesson.component';

describe('CommonLessonComponent', () => {
  let component: CommonLessonComponent;
  let fixture: ComponentFixture<CommonLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
