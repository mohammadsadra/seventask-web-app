import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNewEventComponent } from './calendar-new-event.component';

describe('CalendarNewEventComponent', () => {
  let component: CalendarNewEventComponent;
  let fixture: ComponentFixture<CalendarNewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarNewEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarNewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
