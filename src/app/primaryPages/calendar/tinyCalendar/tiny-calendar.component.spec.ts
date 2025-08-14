import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyCalendarComponent } from './tiny-calendar.component';
import {DirectionService} from '../../../services/directionService/direction.service';
import {CalendarService} from '../../../services/calendarService/calendar.service';
import {CalendarApiService} from '../../../services/calendarService/calendarAPI/calendar-api.service';

describe('TinyCalendarComponent', () => {
  let component: TinyCalendarComponent;
  let fixture: ComponentFixture<TinyCalendarComponent>;

  let directionService: DirectionService;
  let calendarService: CalendarService;
  let calendarServiceApi: CalendarApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinyCalendarComponent ],
      providers: [
        {provide: DirectionService, useValue: directionService},
        {provide: CalendarService, useValue: calendarService},
        {provide: CalendarApiService, useValue: calendarServiceApi},
      ]
    })
    .compileComponents();
    directionService = TestBed.inject(DirectionService);
    calendarService = TestBed.inject(CalendarService);
    calendarServiceApi = TestBed.inject(CalendarApiService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
