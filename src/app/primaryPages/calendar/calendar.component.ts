import {Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {CalendarTypeEnum} from '../../enums/CalendarTypeEnum';
import {CalendarDataService} from '../../services/dataService/calendarDataService/calendar-data.service';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../services/dataService/data.service';
import {TranslateService} from '@ngx-translate/core';
import {EnglishNumberToArabicNumberPipe} from '../../pipes/english-number-to-arabic-number.pipe';
import {AllDayEvent, CalendarData, CalendarDay, CalendarService, MonthEvent, RangeEvent, Weekday} from '../../services/calendarService/calendar.service';
import {CalendarApiService} from '../../services/calendarService/calendarAPI/calendar-api.service';
import {DirectionService} from '../../services/directionService/direction.service';
import {fade, listAnimation} from 'src/animations/animations';
import {ShowMessageInDialogComponent} from '../sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {ButtonTypeEnum} from 'src/app/enums/ButtonTypeEnum';
import {DialogMessageEnum} from 'src/app/enums/DialogMessageEnum';
import {EventResponseModel} from 'src/app/DTOs/calendar/EventResponseModel';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenuTrigger} from '@angular/material/menu';
import {GoogleCalendarModel} from '../../DTOs/calendar/GoogleCalendarModel';
import { EventModel } from 'src/app/DTOs/calendar/EventModel';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [listAnimation, fade]
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarData: CalendarData;

  // each day height in week and day view (px).
  @Input() dayFieldHeight: number = 75;
  @Input() eventCardMinimumHeight: number = 55;

  // all day section height (px).
  @Input() defaultAllDaySectionHeight: number = 20;
  @Input() allDaySectionHeight: number = 20;
  @Input() allDayEventHeight: number = 20;

  // month events height (px).
  @Input() monthEventHeight: number = 20;
  @Input() monthEventsSectionHeight: number = 120;

  // in percentage
  @Input() fullMonthEventsWidth: number = 120;
  @Input() fullMonthEventsOffset: number = -1 * (this.fullMonthEventsWidth - 100) / 2;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = {x: '0px', y: '0px'};

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.showFullEventsOfDay = null;
  }

  public get calendarType(): typeof CalendarTypeEnum {
    return CalendarTypeEnum;
  }

  classifiedEventsList: EventResponseModel[][] = [];
  classifiedEventsListWeekDay: RangeEvent[][] = [];
  classifiedEventsListMonthDay: MonthEvent[][] = [];
  classifiedFullEventsList: MonthEvent[][] = [];
  allDayEvents: AllDayEvent[][] = [];
  allDayEventsList: EventResponseModel[][] = [];
  numberOfOverflowedEvents = {};
  isEventDraggable = {};
  draggingEventTemp: EventResponseModel = null;
  draggingEvent: RangeEvent = null;
  draggingElement = null;
  eventLastPosition = null;
  lastElement = null;
  isEditingStarttime = false;
  isEditingEndtime = false;
  animationDisabled = false;
  wholeEventIsDragging = false;
  enteredWeekDay = null;
  leftWeekDay = null;
  changeEventDate = false;
  isAfterCurrentDate = false;
  enteredNewZone = false;
  addingEventOnDay: boolean[] = [];
  addingEventOnHour: boolean[] = [];
  todayDate = moment(new Date());
  selectedDate = moment(new Date());
  navIconRotateDegree = 0;
  newEventDialogRef;
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();
  weekdays: Weekday[] = [];
  visibleDates: CalendarDay[] = [];
  selectedView = 'month';
  hours = [];
  showDayEventsOf: { id: number, selectedDate: moment.Moment } = null;
  monthDays = [];
  googleCalendarsColorPalette = [
    '#5344a9',
    '#51975a',
    '#bb5098',
    '#f47f6b',
    '#f5c63c'
  ];
  totalEvents = [];
  googleCalendarsMapper = {};
  hiddenGoogleCalendarsId = [];
  hoveredEventId = undefined;
  showFullEventsOfDay = null;

  get selectedDayAbbr() {
    for (const day of this.weekdays) {
      if (day.defaultIndex === this.selectedDate.day()) {
        return day.abbr;
      }
    }
  }

  get currentTime() {
    let hour = String(this.toArabicNumPipe.transform(this.todayDate.hour()));
    let minute = String(this.toArabicNumPipe.transform(this.todayDate.minute()));
    hour = hour.length === 1 ? this.toArabicNumPipe.transform(0) + hour : hour;
    minute = minute.length === 1 ? this.toArabicNumPipe.transform(0) + minute : minute;
    return hour + ':' + minute;
  }

  get currentTimeOffset() {
    return this.todayDate.minute() * this.dayFieldHeight / 60 + this.todayDate.hour() * this.dayFieldHeight;
  }

  get containingToday() {
    for (let date of this.visibleDates) {
      if (date.momentDate.diff(this.todayDate, 'day') === 0 && date.momentDate.day() === this.todayDate.day()) {
        return true;
      }
    }
    return false;
  }

  constructor(
    private calendarDataService: CalendarDataService,
    public calendarService: CalendarService,
    private calendarApiService: CalendarApiService,
    private dataService: DataService,
    public dialog: MatDialog,
    public translateService: TranslateService,
    private directionService: DirectionService,
    private _snackBar: MatSnackBar
  ) {
    this.calendarData = this.calendarService.getCalendarData();
    this.selectedView = this.calendarService.getSelectedView();
    this.selectedDate = this.calendarService.getSelectedDate();
    this.directionService.currentRotation.subscribe(async deg => {
      this.navIconRotateDegree = deg;
      await this.setHeaderDateLabel();
      this.weekdays = await this.calendarService.getWeekdays();
      this.hours = await this.calendarService.getDayHours();
    });
    this.addingEventOnDay = [];
    this.addingEventOnHour = [];
    this.monthDays = [];
  }

  ngOnInit(): void {
    // updating today each 1 minute.
    setTimeout(() => {
      this.todayDate = moment(new Date());
      setInterval(() => {
        this.todayDate = moment(new Date());
      }, 60000);
    }, 60000 - (this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));


    if (TextDirectionController.textDirection === 'rtl') {
      this.navIconRotateDegree = 180;
    }

    this.calendarDataService.newEventObservable.subscribe((event: EventResponseModel) => {
      if (event) {
        this.addEvent(event);
      }
    });

    this.calendarDataService.getUpdatedEvent.subscribe((event: EventResponseModel) => {
      if (event) {
        for (let events of this.classifiedEventsList) {
          for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
            if (events[eventIndex].id === event.id) {
              events[eventIndex] = event;
              break;
            }
          }
        } 
        this.updateCalendars();
      }
    });

    this.calendarDataService.getDeletedEventId.subscribe((eventId: number) => {
      if (eventId !== null) {
        this.totalEvents.filter(event => event.id !== eventId);
        this.updateCalendars();
        this.calendarApiService.getNumberOfTasksAndEvents(
          moment(this.visibleDates[0].momentDate).add(-1, 'days').set({h: 23, m: 59, s: 59}).format('YYYY-MM-DDTHH:mm:ss'),
          moment(this.visibleDates[this.visibleDates.length - 1].momentDate).add(1, 'days').set({
            h: 0,
            m: 0,
            s: 1
          }).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(result => {
            this.calendarDataService.sendNumberOfTasksAndEvents(result.value);
          });
      }
    });

    this.calendarDataService.goTodayObservable.subscribe((bool) => {
      if (bool) {
        this.selectedDate = moment(new Date());
        this.calendarService.setSelectedDate(this.selectedDate);
        this.addingEventOnDay = [];
        this.addingEventOnHour = [];
        this.classifiedEventsList = [];
        this.classifiedEventsListWeekDay = [];
        this.monthDays = [];
        this.fillVisibleDateAndEvents();
      }
    });

    this.calendarDataService.changeViewObservable.subscribe((view) => {
      if (view) {
        this.selectedView = view;
        this.addingEventOnDay = [];
        this.addingEventOnHour = [];
        this.classifiedEventsList = [];
        this.classifiedEventsListWeekDay = [];
        this.monthDays = [];
        this.fillVisibleDateAndEvents();
      }
    });

    this.calendarDataService.showOrHideGoogleObservable.subscribe((status: {show: boolean, id: string}) => {
      if (status && this.googleCalendarsMapper[status.id] && this.googleCalendarsMapper[status.id].length > 0) {
        if (status.show) {
          const calendarIndex = this.hiddenGoogleCalendarsId.indexOf(status.id);
          if (calendarIndex !== -1) {
            this.hiddenGoogleCalendarsId.splice(calendarIndex, 1);
          }
          this.updateCalendars();
        } else {
          const calendarIndex = this.hiddenGoogleCalendarsId.indexOf(status.id);
          if (calendarIndex === -1) {
            this.hiddenGoogleCalendarsId.push(status.id);
          }      
          this.updateCalendars();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.calendarService.updateCalendarDataInLocalStorage();
  }

  @HostListener('document:mousemove', ['$event'])
  handleEventDragging(e) {
    const mainContainer = this.selectedView === 'week' ?
      document.getElementById('week-view-container').getBoundingClientRect() :
      (this.selectedView === 'day' ? document.getElementById('day-view-container').getBoundingClientRect() : null);

    if (this.eventLastPosition && this.draggingEvent) {
      let timeToAdd = 60 * (e.pageY - this.eventLastPosition.pageY) / this.dayFieldHeight;
      let lengthToAdd = this.isEditingEndtime || this.wholeEventIsDragging ? e.pageY - this.eventLastPosition.pageY :
        (this.isEditingStarttime ? this.eventLastPosition.pageY - e.pageY : 0);

      if (e.pageY <= mainContainer.top || e.pageY >= mainContainer.height + mainContainer.top) {
        timeToAdd = 0;
        lengthToAdd = 0;
      }
      if (!this.wholeEventIsDragging) {
        // Editing End Time
        if (this.isEditingEndtime &&
          (this.draggingEvent.length + lengthToAdd >= this.eventCardMinimumHeight || this.draggingEvent.length < this.eventCardMinimumHeight || !this.draggingEvent.isStartingAtCurrentDay)
          && timeToAdd !== 0 && lengthToAdd !== 0 && this.draggingEvent.yOffset + this.draggingEvent.length + 2 + lengthToAdd <= mainContainer.height) {
          if (this.visibleDates[this.enteredWeekDay].momentDate.day() !== moment(this.draggingEvent.event.endTime).day()) {
            let newEditedTime = moment(this.draggingEvent.event.endTime).add(
              24 * (this.visibleDates[this.enteredWeekDay].momentDate.day() - moment(this.draggingEvent.event.endTime).day()), 'hours'
            );
            if (newEditedTime.toDate() > this.draggingEvent.event.startTime &&
              (newEditedTime.diff(moment(this.draggingEvent.event.startTime), 'minutes') * this.dayFieldHeight / 60) >= this.eventCardMinimumHeight) {
              const eventId = this.draggingEvent.event.id;
              this.draggingEvent.event.endTime = newEditedTime.toDate();
              const totalEvents = [];
              for (let events of this.classifiedEventsList) {
                for (let event of events) {
                  totalEvents.push(event);
                }
              }
              this.classifiedEventsList = this.calendarService.getEachDayEvents(totalEvents, this.visibleDates, false);
              this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
                this.dayFieldHeight, this.eventCardMinimumHeight);
              for (let rangeEvent of this.classifiedEventsListWeekDay[this.enteredWeekDay]) {
                if (rangeEvent.event.id === eventId) {
                  this.draggingEvent = rangeEvent;
                  break;
                }
              }
            }
          } else {
            this.draggingEvent.event.endTime = (moment(this.draggingEvent.event.endTime)
              .add(timeToAdd, 'minutes')).toDate();
            this.draggingEvent.length += lengthToAdd;
          }
        } else if (this.isEditingStarttime && (this.draggingEvent.length + lengthToAdd >= this.eventCardMinimumHeight || this.draggingEvent.length < this.eventCardMinimumHeight)
          && timeToAdd !== 0 && lengthToAdd !== 0 && this.draggingEvent.yOffset - lengthToAdd >= 0) {
          // Editing Start Time
          if (this.visibleDates[this.enteredWeekDay].momentDate.day() !== moment(this.draggingEvent.event.startTime).day()) {
            let newEditedTime = moment(this.draggingEvent.event.startTime).add(
              24 * (this.visibleDates[this.enteredWeekDay].momentDate.day() - moment(this.draggingEvent.event.startTime).day()), 'hours'
            );
            if (newEditedTime.toDate() < this.draggingEvent.event.endTime &&
              (moment(this.draggingEvent.event.endTime).diff(newEditedTime, 'minutes') * this.dayFieldHeight / 60) >= this.eventCardMinimumHeight) {
              const eventId = this.draggingEvent.event.id;

              let currentDayIndex = null;
              let eventIndex = null;

              for (let dayIndex = 0; dayIndex < this.classifiedEventsList.length; dayIndex++) {
                for (let index = 0; index < this.classifiedEventsList[dayIndex].length; index++) {
                  if (this.classifiedEventsList[dayIndex][index].id === this.draggingEvent.event.id) {
                    eventIndex = index;
                    currentDayIndex = dayIndex;
                    break;
                  }
                }
                if (eventIndex !== null) {
                  break;
                }
              }
              this.draggingEvent.event.startTime = newEditedTime.toDate();
              this.classifiedEventsList[this.enteredWeekDay].push(this.draggingEvent.event);
              this.classifiedEventsList[currentDayIndex].splice(eventIndex, 1);
              this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
                this.dayFieldHeight, this.eventCardMinimumHeight);

              for (let rangeEvent of this.classifiedEventsListWeekDay[this.enteredWeekDay]) {
                if (rangeEvent.event.id === eventId) {
                  this.draggingEvent = rangeEvent;
                  break;
                }
              }
            }
          } else {
            this.draggingEvent.event.startTime = (moment(this.draggingEvent.event.startTime)
              .add(timeToAdd, 'minutes')).toDate();
            this.draggingEvent.yOffset -= lengthToAdd;
            this.draggingEvent.length += lengthToAdd;
          }
        }
      } else {
        let eventId = this.draggingEvent.event.id;
        let lastStartTime = new Date(this.draggingEvent.event.startTime);
        let lastEndTime = new Date(this.draggingEvent.event.endTime);

        this.draggingEvent.event.startTime = (moment(this.draggingEvent.event.startTime)
          .add(timeToAdd, 'minute')).toDate();
        this.draggingEvent.event.endTime = (moment(this.draggingEvent.event.endTime)
          .add(timeToAdd, 'minute')).toDate();

        if (this.enteredWeekDay !== null && this.leftWeekDay !== null && this.enteredWeekDay - this.leftWeekDay !== 0 && this.enteredNewZone) {
          let daysToAdd = this.enteredWeekDay - this.leftWeekDay;
          this.enteredNewZone = false;
          this.draggingEvent.event.startTime = moment(this.draggingEvent.event.startTime).add(
            24 * daysToAdd, 'hours'
          ).toDate();
          this.draggingEvent.event.endTime = moment(this.draggingEvent.event.endTime).add(
            24 * daysToAdd, 'hours'
          ).toDate();
          this.changeEventDate = true;
          this.isAfterCurrentDate = daysToAdd >= 0 ? true : false;
        }

        if (lastStartTime.getDay() !== this.draggingEvent.event.startTime.getDay() ||
          lastEndTime.getDay() !== this.draggingEvent.event.endTime.getDay()) {
          const totalEvents = [];
          for (let events of this.classifiedEventsList) {
            for (let event of events) {
              totalEvents.push(event);
            }
          }
          this.classifiedEventsList = this.calendarService.getEachDayEvents(totalEvents, this.visibleDates, false);
        }
        this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
          this.dayFieldHeight, this.eventCardMinimumHeight);
        for (let rangeEvent of this.classifiedEventsListWeekDay[this.enteredWeekDay]) {
          if (rangeEvent.event.id === eventId) {
            this.draggingEvent = rangeEvent;
            break;
          }
        }
      }
      this.eventLastPosition = e;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  handleMouseUpInEventDragging(e) {
    if (this.draggingEvent) {
      if (this.isEditingEndtime && !this.wholeEventIsDragging) {
        this.calendarApiService
          .editEventEndTime(this.draggingEvent.event.id, moment.utc(this.draggingEvent.event.endTime).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(() => {
            this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
              this.dayFieldHeight, this.eventCardMinimumHeight);
          });
      } else if (this.isEditingStarttime && !this.wholeEventIsDragging) {
        this.calendarApiService
          .editEventStartTime(this.draggingEvent.event.id, moment.utc(this.draggingEvent.event.startTime).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(() => {
            this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
              this.dayFieldHeight, this.eventCardMinimumHeight);
          });
      } else if (this.wholeEventIsDragging) {
        let tempEvent = {...this.draggingEvent.event};

        if (moment(this.draggingEventTemp.endTime).toDate() < moment(tempEvent.endTime).toDate()) {
          this.calendarApiService
            .editEventEndTime(tempEvent.id, moment.utc(tempEvent.endTime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(() => {
              this.calendarApiService
                .editEventStartTime(tempEvent.id, moment.utc(tempEvent.startTime).format('YYYY-MM-DDTHH:mm:ss'))
                .subscribe(() => {

                });
            });
        } else {
          this.calendarApiService
            .editEventStartTime(tempEvent.id, moment.utc(tempEvent.startTime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(() => {
              this.calendarApiService
                .editEventEndTime(tempEvent.id, moment.utc(tempEvent.endTime).format('YYYY-MM-DDTHH:mm:ss'))
                .subscribe(() => {

                });
            });
        }
      }
      this.leftWeekDay = null;
      this.draggingEvent = null;
      this.draggingEventTemp = null;
      this.eventLastPosition = null;
      this.isEditingEndtime = false;
      this.isEditingStarttime = false;
      this.wholeEventIsDragging = false;
      this.isAfterCurrentDate = false;
      this.changeEventDate = false;
    }
  }

  scrollToNowBar() {
    if (['week', 'day'].includes(this.selectedView) && this.containingToday) {
      document.getElementById('page-content').scroll({
        top: this.currentTimeOffset - 100,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  mouseEnterWeekDay(e, day) {
    if (this.draggingEvent) {
      this.enteredNewZone = true;
      this.leftWeekDay = this.enteredWeekDay;
    }
    this.enteredWeekDay = day;
  }

  mouseEnterMonthDay(event: any, dateStr: string) {
    this.addingEventOnDay[dateStr] = true;
  }

  mouseLeaveMonthDay(event: any, dateStr: string) {
    this.addingEventOnDay[dateStr] = false;
  }

  addToCurrentDay(num: number, unit) {
    this.visibleDates = [];
    this.selectedDate = this.calendarService.addAmountToDate(this.selectedDate, num, unit);
    this.calendarService.setSelectedDate(this.selectedDate);
    this.addingEventOnDay = [];
    this.fillVisibleDateAndEvents();
  }

  fillVisibleDateAndEvents() {
    this.showFullEventsOfDay = null;
    this.allDaySectionHeight = this.defaultAllDaySectionHeight;
    this.allDayEvents = [];
    this.classifiedEventsList = [];
    this.classifiedEventsListWeekDay = [];
    this.classifiedEventsListMonthDay = [];
    this.classifiedFullEventsList = [];
    this.isEventDraggable = {};
    this.draggingEvent = null;
    this.animationDisabled = false;
    this.numberOfOverflowedEvents = {};
    this.calendarService
      .fillVisibleDates(this.selectedDate, this.selectedView)
      .then(async (visibleDates: CalendarDay[]) => {
        this.visibleDates = visibleDates;
        await this.setHeaderDateLabel();
        this.weekdays = await this.calendarService.getWeekdays();
        let startDate = moment(visibleDates[0].momentDate).add(-1, 'days');
        let endDate = moment(visibleDates[visibleDates.length - 1].momentDate).add(1, 'days');
        if (this.selectedView === 'year') {
          this.monthDays = [];
          let startingDate = moment(visibleDates[1].momentDate);
          for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            this.monthDays.push(moment(startingDate));
            startingDate.add(31, 'days');
          }
        }
        this.calendarApiService
          .getEventsInPeriod(
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD'))
          .subscribe(events => {            
            // merge google calendars events                  
            if (events.value.googleCalendarsEvents) {
              for (let i = 0; i < events.value.googleCalendarsEvents.length; i++) {
                const googleCalendarId = events.value.googleCalendarsEvents[i].googleCalendar.id;
                if (!this.googleCalendarsMapper[googleCalendarId]) {
                  this.googleCalendarsMapper[googleCalendarId] = [];
                }
                for (let j = 0; j < events.value.googleCalendarsEvents[i].googelEvents.length; j++) {
                  const tempEvent = events.value.googleCalendarsEvents[i].googelEvents[j];
                  tempEvent.color = this.googleCalendarsColorPalette[i % 5];
                  events.value.sevenTaskEvents.push(tempEvent);
                  this.googleCalendarsMapper[googleCalendarId].push(tempEvent.googleCalendarEventId);
                }
              }
            }
            this.totalEvents = events.value.sevenTaskEvents;            
            this.updateCalendars();
            this.scrollToNowBar();
            setTimeout(() => {
              this.animationDisabled = true;
            }, 100);
            const googleCalendarsEvents = events.value.googleCalendarsEvents;
            const googleCalendars: GoogleCalendarModel[] = [];
            for (let i = 0; i < googleCalendarsEvents.length; i++) {
              if (googleCalendarsEvents[i].googleCalendar.title) {
                googleCalendars.push(googleCalendarsEvents[i].googleCalendar);
              }
            }
            this.calendarDataService.updateGoogleCalendars(googleCalendars);
          });
        this.calendarApiService.getNumberOfTasksAndEvents(
          startDate.set({h: 23, m: 59, s: 59}).format('YYYY-MM-DDTHH:mm:ss'),
          endDate.set({h: 0, m: 0, s: 1}).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(result => {
            this.calendarDataService.sendNumberOfTasksAndEvents(result.value);
          });
      });
  }

  updateCalendars() {
    let showingEvents = this.totalEvents.filter(event => {
      for (let googleCalendarId of this.hiddenGoogleCalendarsId) {        
        if (this.googleCalendarsMapper[googleCalendarId] && 
            this.googleCalendarsMapper[googleCalendarId].includes(event.googleCalendarEventId)) {
          return false;
        }
      }
      return true
    });

    this.classifiedEventsList = this.calendarService.getEachDayEvents(showingEvents, this.visibleDates);     

    this.classifiedEventsList.forEach((events, index) => {
      // Filtering all-day events.
      this.allDayEventsList[index] = events.filter(event => event.isAllDay);
      if (this.selectedView === 'week' || this.selectedView === 'day') {
        this.classifiedEventsList[index] = events.filter(event => !event.isAllDay);
      }
      events.forEach(event => {
        this.isEventDraggable[event.id] = false;
      });
    });

    this.updateAllDayEvents();

    if (this.selectedView === 'week' || this.selectedView === 'day') {
      this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
        this.dayFieldHeight, this.eventCardMinimumHeight);
    } else if (this.selectedView === 'month') {
      this.classifiedFullEventsList = this.calendarService.getFullEventsOfEachDay(this.classifiedEventsList, this.visibleDates, this.monthEventHeight);
      this.numberOfOverflowedEvents = {};
      this.classifiedEventsListMonthDay = this.calendarService.getMonthEvents(this.classifiedEventsList, this.visibleDates, this.monthEventHeight);
      for (let weekStart = 0; weekStart < this.classifiedEventsListMonthDay.length; weekStart += 7) {
        for (let dayIndex = weekStart; dayIndex < weekStart + 7; dayIndex++) {
          if (this.calendarService.isFieldOverflowed(this.classifiedEventsListMonthDay[dayIndex], this.monthEventsSectionHeight ,this.monthEventHeight)) {
            const overflowedEvents = this.classifiedEventsListMonthDay[dayIndex].filter(event => event.yOffset + event.height >= this.monthEventsSectionHeight);
            for (let event of overflowedEvents) {
              let tempDay = dayIndex;
              let startingDate = moment(event.event.startTime).startOf('day');
              while (startingDate.isSameOrBefore(moment(event.event.endTime).startOf('day')) && tempDay < weekStart + 7) {
                this.numberOfOverflowedEvents[tempDay] = this.numberOfOverflowedEvents[tempDay] ? this.numberOfOverflowedEvents[tempDay] + 1 : 1;
                startingDate.add(1, 'days');
                tempDay += 1;
              }
            }
            this.classifiedEventsListMonthDay[dayIndex] = this.classifiedEventsListMonthDay[dayIndex].filter(event => event.yOffset + event.height < this.monthEventsSectionHeight);
          }
        }
      }
    }
  }

  updateAllDayEvents() {
    this.allDayEvents = this.calendarService.getAllDayEvents(this.allDayEventsList, this.visibleDates, this.allDayEventHeight);
    this.allDaySectionHeight = this.calendarService.getUpdatedAllDaySection(this.allDayEvents, this.defaultAllDaySectionHeight);
  }

  onContextMenu($e: MouseEvent, event, dayIndex) {
    $e.preventDefault();
    this.contextMenuPosition.x = $e.clientX + 'px';
    this.contextMenuPosition.y = $e.clientY + 'px';
    this.contextMenu.menuData = {
      'event': event,
      'dayIndex': dayIndex
    };
    this.contextMenu.openMenu();
  }

  selectEvent(event: EventResponseModel) {
    this.calendarDataService.selectEvent(event);
  }

  addEvent(event: EventResponseModel) {
    event.startTime = new Date(event.startTime);
    event.endTime = new Date(event.endTime);
    for (let dayIndex = 0; dayIndex < this.visibleDates.length; dayIndex++) {
      if (this.visibleDates[dayIndex].momentDate.format('YYYY-MM-DD') === moment(event.startTime).format('YYYY-MM-DD')) {
        this.classifiedEventsList[dayIndex].push(event);
        this.totalEvents.push(event);
        this.updateCalendars();
      }
    }
    this.calendarApiService.getNumberOfTasksAndEvents(
      moment(this.visibleDates[0].momentDate).add(-1, 'days').set({h: 23, m: 59, s: 59}).format('YYYY-MM-DDTHH:mm:ss'),
      moment(this.visibleDates[this.visibleDates.length - 1].momentDate).add(1, 'days').set({
        h: 0,
        m: 0,
        s: 1
      }).format('YYYY-MM-DDTHH:mm:ss'))
      .subscribe(result => {
        this.calendarDataService.sendNumberOfTasksAndEvents(result.value);
      });
  }

  createEvent(date: Date, hour: number) {
    date.setHours(hour);
    date.setMinutes(0);
    const dialogRef = this.calendarService.createNewEvent(date);
    this.newEventDialogRef = dialogRef;
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  deleteEvent(eventId: number, dayIndex: number) {
    this.calendarApiService.deleteEvent(eventId).subscribe(async (success) => {
      this.calendarDataService.deleteEvent(eventId);
      if (this.selectedView !== 'year') {
        this.classifiedEventsList[dayIndex] = this.classifiedEventsList[dayIndex].filter(event => event.id !== eventId);
        if (this.selectedView !== 'month') {
          this.classifiedEventsListWeekDay = this.calendarService.getRangeWeekDayEvents(this.classifiedEventsList, this.visibleDates,
            this.dayFieldHeight, this.eventCardMinimumHeight);
        }
      } else {
        for (let events of this.classifiedEventsList) {
          for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
            if (events[eventIndex].id === eventId) {
              events = events.splice(eventIndex, 1);
              this.classifiedEventsList = this.classifiedEventsList.slice();
              break;
            }
          }
        }
      }
      this.totalEvents = this.totalEvents.filter(event => event.id !== eventId);
      this.calendarApiService.getNumberOfTasksAndEvents(
        moment(this.visibleDates[0].momentDate).add(-1, 'days').set({h: 23, m: 59, s: 59}).format('YYYY-MM-DDTHH:mm:ss'),
        moment(this.visibleDates[this.visibleDates.length - 1].momentDate).add(1, 'days').set({
          h: 0,
          m: 0,
          s: 1
        }).format('YYYY-MM-DDTHH:mm:ss'))
        .subscribe(result => {
          this.calendarDataService.sendNumberOfTasksAndEvents(result.value);
        });
      this.updateCalendars();
      this.openSnackBar(await this.translateService.get('Snackbar.eventDeleted').toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise());
    }, async (error) => {
      this.openSnackBar(await this.translateService.get('Snackbar.deleteEventError').toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise());
    });
  }

  handleDeleteEvent() {
    let event = this.contextMenu.menuData.event;
    let dayIndex = this.contextMenu.menuData.dayIndex;

    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteEvent,
        itemName: this.selectedView === 'month' || this.selectedView === 'year' ? event.title : event.event.title,
      },
    });
    const eventId = this.selectedView === 'month' || this.selectedView === 'year' ? event.id : event.event.id;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.deleteEvent(eventId, dayIndex);
        }
      }
    });
  }

  async setHeaderDateLabel() {
    let mainDateStr = '';
    let alternativeDateStr = '';
    switch (this.calendarData.firstCalendar) {
      case CalendarTypeEnum.GEORGIAN:
        mainDateStr = `${await this.calendarService.getMonthName(
          this.selectedDate.month()
        )} ${this.toArabicNumPipe.transform(this.selectedDate.year())}`;
        break;
      case CalendarTypeEnum.JALALI:
        mainDateStr = `${await this.calendarService.getJalaliMonthName(
          jmoment(this.selectedDate.toDate()).jMonth()
        )} ${this.toArabicNumPipe.transform(
          jmoment(this.selectedDate.toDate()).jYear()
        )}`;
        break;
    }
    if (this.calendarData.isSecondCalendarEnabled
      && this.calendarData.secondCalendar !== this.calendarData.firstCalendar) {
      switch (this.calendarData.secondCalendar) {
        case CalendarTypeEnum.GEORGIAN:
          const startOfCurrentJMonth = moment(
            jmoment(this.selectedDate.toDate()).startOf('jmonth').toDate()
          );
          const endOfCurrentJMonth = moment(
            jmoment(this.selectedDate.toDate()).endOf('jmonth').toDate()
          );
          alternativeDateStr = `${await this.calendarService.getMonthName(
            startOfCurrentJMonth.month()
          )} - ${await this.calendarService.getMonthName(endOfCurrentJMonth.month())}`;
          break;
        case CalendarTypeEnum.JALALI:
          const startOfCurrentMonth = moment(this.selectedDate).startOf(
            'month'
          );
          const endOfCurrentMonth = moment(this.selectedDate).endOf('month');
          alternativeDateStr = `${await this.calendarService.getJalaliMonthName(
            jmoment(startOfCurrentMonth.toDate()).jMonth()
          )} - ${await this.calendarService.getJalaliMonthName(
            jmoment(endOfCurrentMonth.toDate()).jMonth()
          )}`;
          break;
      }
    }
    this.calendarDataService.changeHeaderDateLabel(mainDateStr);
    this.calendarDataService.changeHeaderAlternativeDateLabel(
      alternativeDateStr
    );
  }

  addOrRemoveResizeCursor(e, rangeEvent: RangeEvent) {
    if (this.draggingEvent === null) {
      if (e.target.className.includes('calendar-weekday-event') &&
        ((rangeEvent.length - e.offsetY <= 8 && rangeEvent.isEndingAtCurrentDay) || (e.offsetY <= 8 && rangeEvent.isStartingAtCurrentDay))) {
        this.wholeEventIsDragging = false;
        e.target.classList.add('drag-cursor');
      } else {
        this.wholeEventIsDragging = true;
        if (this.lastElement) {
          this.lastElement.classList.remove('drag-cursor');
        }
      }
      this.lastElement = e.target;
      this.isEventDraggable[rangeEvent.event.id] = true;
    }
  }

  createMonthEvent(e, dayIndex) {
    this.calendarApiService.createEvent(
      new EventModel(
        '(No Title)',
        '',
        true,
        '',
        this.visibleDates[dayIndex].momentDate.startOf('day').toDate(),
        this.visibleDates[dayIndex].momentDate.startOf('day').toDate(),
        null,
        [],
        [],
        [],
        [],
        []
      )
    ).subscribe(result => {
      this.calendarDataService.createdNewEvent(result.value);
      this.selectEvent(result.value);
    })
  }

  eventMouseDown(e, rangeEvent: RangeEvent) {
    this.enteredNewZone = true;
    if (this.isEventDraggable[rangeEvent.event.id]) {
      this.draggingEvent = rangeEvent;
      this.draggingEventTemp = JSON.parse(JSON.stringify(this.draggingEvent.event));
      this.eventLastPosition = e;
      if (rangeEvent.isStartingAtCurrentDay && rangeEvent.isEndingAtCurrentDay) {
        e.offsetY <= 5 ? this.isEditingStarttime = true : this.isEditingEndtime = true;
      } else {
        rangeEvent.isStartingAtCurrentDay ? this.isEditingStarttime = true : this.isEditingEndtime = true;
      }
    }
  }

  hexToRgbA(hex, opacity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // tslint:disable-next-line:no-bitwise
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
  }
}
