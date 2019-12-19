import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeFormComponent } from './relative-form.component';

describe('RelativeFormComponent', () => {
  let component: RelativeFormComponent;
  let fixture: ComponentFixture<RelativeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
