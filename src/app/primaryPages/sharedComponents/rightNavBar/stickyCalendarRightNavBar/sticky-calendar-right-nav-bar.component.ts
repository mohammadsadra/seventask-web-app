import {AfterViewChecked, Component, HostListener, Input, OnInit} from '@angular/core';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {CalendarData, CalendarDay, CalendarService} from '../../../../services/calendarService/calendar.service';
import {CalendarTypeEnum} from '../../../../enums/CalendarTypeEnum';
import * as moment from 'moment';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {EnglishNumberToArabicNumberPipe} from '../../../../pipes/english-number-to-arabic-number.pipe';
import {CalendarApiService} from '../../../../services/calendarService/calendarAPI/calendar-api.service';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { CalendarDataService } from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {GoogleCalendarModel} from '../../../../DTOs/calendar/GoogleCalendarModel';

@Component({
  selector: 'app-sticky-calendar-right-nav-bar',
  templateUrl: './sticky-calendar-right-nav-bar.component.html',
  styleUrls: ['./sticky-calendar-right-nav-bar.component.scss']
})
export class StickyCalendarRightNavBarComponent implements OnInit, AfterViewChecked {
  calendarData: CalendarData;
  navIconRotateDegree = 0;
  eventTitleWidth = 180;
  selectedEvent: EventResponseModel = null;
  googleCalendarsColorPalette = [
    '#5344a9',
    '#51975a',
    '#bb5098',
    '#f47f6b',
    '#f5c63c'
  ];

  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();

  public get calendarType(): typeof CalendarTypeEnum {
    return CalendarTypeEnum;
  }

  constructor(private directionService: DirectionService,
              private calendarService: CalendarService,
              private calendarDataService: CalendarDataService,
              private calendarApiService: CalendarApiService) {
    this.calendarData = this.calendarService.getCalendarData();
    this.directionService.currentRotation.subscribe(async deg => {
      this.navIconRotateDegree = deg;
      this.weekdays = await this.calendarService.getWeekdays();
    });
    this.fillVisibleEvents();
  }

  weekdays = [];
  classifiedEventsList: EventResponseModel[][] = [];
  visibleDates: CalendarDay[] = [];
  todayDate = moment(new Date());
  gotEvents = false;
  showPassedEvents = false;
  showEventsButtonPressed = false;

  todayEvents: EventResponseModel[] = [];
  tomorrowEvents: EventResponseModel[] = [];
  weekEvents: EventResponseModel[] = [];
  monthEvents: EventResponseModel[] = [];
  passedEvents: EventResponseModel[] = [];

  height = window.innerHeight;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  ngOnInit(): void {
    // updating today each 1 minute.
    setTimeout( () => {
      this.todayDate = moment(new Date());
      this.updateTodayEvents();
      setInterval( () => {
        this.todayDate = moment(new Date());
        this.updateTodayEvents();
      }, 60000);
    }, 60000 - (this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));

    this.calendarService.getWeekdays().then(weekdays => {
      this.weekdays = weekdays;
    });

    this.calendarDataService.getDeletedEventId.subscribe((id) => {
      if (id) {
        for (let i = 0; i < this.classifiedEventsList.length; i++) {
          this.classifiedEventsList[i] = this.classifiedEventsList[i].filter(event => event.id !== id);
        }
        this.fillDateEvents();
      }
    });

    this.calendarDataService.getUpdatedEvent.subscribe((event: EventResponseModel) => {
      if (event) {
        for (const events of this.classifiedEventsList) {
          for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
            if (events[eventIndex].id === event.id) {
              events[eventIndex] = event;
              this.fillDateEvents();
              break;
            }
          }
        }
      }
    });
    if (TextDirectionController.textDirection === 'rtl') {
      this.navIconRotateDegree = 180;
    }
  }

  ngAfterViewChecked(): void {
    if (this.showPassedEvents && !this.showEventsButtonPressed) {
      this.showEventsButtonPressed = true;

      const eventsContainer = document.getElementById('events-list');
      const todayEvents = document.getElementById('today-events');

      if (eventsContainer.offsetHeight + eventsContainer.scrollTop < todayEvents.scrollHeight) {
        eventsContainer.scroll({
          top: todayEvents.scrollHeight + eventsContainer.scrollTop - eventsContainer.offsetHeight,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  eventPassed(event: EventResponseModel) {
    return moment(event.endTime).isBefore(this.todayDate);
  }

  fillDateEvents() {
    const coveredEvents = [];
    this.todayEvents = [];
    this.tomorrowEvents = [];
    this.weekEvents = [];
    this.monthEvents = [];
    this.passedEvents = [];

    this.classifiedEventsList.forEach((events, dayIndex) => {
      const day = this.visibleDates[dayIndex].momentDate;
      if (day.diff(this.todayDate, 'day') === 0 && day.day() === this.todayDate.day()) {
        events.forEach((event) => {
          if (!coveredEvents.includes(event)) {
            this.todayEvents.push(event);
            coveredEvents.push(event);
          }
        });
      }
      if (day.diff(this.todayDate, 'hours') <= 24 && day.diff(this.todayDate, 'hours') >= 0
        && day.day() === (this.todayDate.day() + 1) % 7) {
        events.forEach((event) => {
          if (!coveredEvents.includes(event)) {
            this.tomorrowEvents.push(event);
            coveredEvents.push(event);
          }
        });
      }
      if (day.diff(this.todayDate, 'day') <= 7) {
        events.forEach((event) => {
          if (!coveredEvents.includes(event)) {
            this.weekEvents.push(event);
            coveredEvents.push(event);
          }
        });
      }
      if (day.diff(this.todayDate, 'days') <= 30) {
        events.forEach((event) => {
          if (!coveredEvents.includes(event)) {
            this.monthEvents.push(event);
            coveredEvents.push(event);
          }
        });
      }
    });
    this.todayEvents.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
    this.tomorrowEvents.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
    this.weekEvents.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
    this.monthEvents.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
    while (this.todayEvents.length && this.eventPassed(this.todayEvents[0])) {
      this.passedEvents.push(this.todayEvents.shift());
    }
    this.gotEvents = true;
  }

  fillVisibleEvents() {
    const startDate = moment(this.todayDate).add(-1, 'days');
    const endDate = moment(startDate).add(1, 'months');

    this.calendarApiService
      .getEventsInPeriod(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'))
      .subscribe((events) => {
        while (startDate.diff(endDate, 'day') !== 0) {
          this.visibleDates.push(new CalendarDay(moment(startDate.add(1, 'day')), true));
        }
        if (events.value.googleCalendarsEvents) {
          for (let i = 0; i < events.value.googleCalendarsEvents.length; i++) {
            for (let j = 0; j < events.value.googleCalendarsEvents[i].googelEvents.length; j++) {
              const tempEvent = events.value.googleCalendarsEvents[i].googelEvents[j];
              tempEvent.color = this.googleCalendarsColorPalette[i % 5];
              events.value.sevenTaskEvents.push(tempEvent);
            }
          }
        } 
        this.classifiedEventsList = this.calendarService.getEachDayEvents(events.value.sevenTaskEvents, this.visibleDates);
        this.fillDateEvents();
      });
  }

  updateTodayEvents() {
    while (this.todayEvents.length && this.eventPassed(this.todayEvents[0])) {
      this.passedEvents.push(this.todayEvents.shift());
    }
  }
}
