import {Component, HostListener, OnInit} from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { CalendarApiService } from 'src/app/services/calendarService/calendarAPI/calendar-api.service';
import { CalendarDataService } from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {CalendarData, CalendarService, RangeEvent} from '../../../../services/calendarService/calendar.service';
import {DirectionService} from '../../../../services/directionService/direction.service';
import { CalendarTypeEnum } from 'src/app/enums/CalendarTypeEnum';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { JalaliDatePipe } from 'src/app/pipes/jalali-date.pipe';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { DomainName } from 'src/app/utilities/PathTools';
import { FileService } from '../../uploadFile/fileService/file.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calendar-right-nav-bar',
  templateUrl: './calendar-right-nav-bar.component.html',
  styleUrls: ['./calendar-right-nav-bar.component.scss']
})
export class CalendarRightNavBarComponent implements OnInit {

  domainName: string = DomainName;
  height = window.innerHeight;

  private todayDate = moment(new Date());
  private calendarData: CalendarData;
  public todayDateInformation: {date: string, month: string, weekDay: string} = {
    date: '',
    month: '',
    weekDay: ''
  };
  public hours: string[]  = [];
  public hourFieldHeight = 70; // px
  public eventCardMinimumHeight = 55; // px

  jalaliDatePipe = new JalaliDatePipe();

  navIconRotateDegree = 0;
  rangeEvents: RangeEvent[][] = [];
  selectedEvent: EventResponseModel = null;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  constructor(public calendarService: CalendarService,
              public calendarApiService: CalendarApiService,
              public calendarDataService: CalendarDataService,
              public translateService: TranslateService,
              private fileService: FileService,
              private dialog: MatDialog,
              public snackBar: MatSnackBar,
              public directionService: DirectionService,
              public datePipe: DatePipe) {
      this.directionService.currentRotation.subscribe(deg => {
        this.navIconRotateDegree = deg;
      });
      this.calendarData = this.calendarService.getCalendarData();
      this.calendarService.getDayHours().then(res => this.hours = res);
      this.updateTodayDateInformation();
      this.fillEvents();
  }

  ngOnInit(): void {
    // updating today each 1 minute.
    setTimeout( () => {
      this.todayDate = moment(new Date());
      setInterval( () => {
        if (this.todayDate.day() != moment(new Date()).day()) {
          this.todayDate = moment(new Date());
          this.updateTodayDateInformation();
          this.fillEvents();
        }
        this.todayDate = moment(new Date());
      }, 60000);
    }, 60000 - (this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));

    this.calendarDataService.getDeletedEventId.subscribe(id => {
      if (id !== null) {
        if (this.selectedEvent !== null && id === this.selectedEvent.id) {
          this.selectedEvent = null;
        }
        let shouldUpdate = false;
        for (let events of this.rangeEvents) {
          for (let event of events) {
            if (event.event.id === id) {
              shouldUpdate = true;
            }
          }
        }
        if (shouldUpdate) {
          this.fillEvents();
        }
      }
    })
    this.calendarDataService.getSelectedEvent.subscribe(event => {
      if (event != null) {
        this.selectedEvent = event;
      }
    });
  }

  async updateTodayDateInformation() {
    switch (this.todayDate.day()) {
      case 0:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.sun').toPromise();
        break;
      case 1:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.mon').toPromise();
        break;
      case 2:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.tue').toPromise();
        break;
      case 3:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.wed').toPromise();
        break;
      case 4:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.thu').toPromise();
        break;
      case 5:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.fri').toPromise();
        break;
      case 6:
        this.todayDateInformation.weekDay = await this.translateService.get('Calendar.FullWeekDays.sat').toPromise();
        break;
    }
    switch (this.calendarData.firstCalendar) {
      case CalendarTypeEnum.GEORGIAN:
        this.todayDateInformation.date = this.datePipe.transform(this.todayDate.toDate(), 'd');
        this.todayDateInformation.month = await this.calendarService.getMonthName(this.todayDate.month());
        break;
      case CalendarTypeEnum.JALALI:
        this.todayDateInformation.date = this.jalaliDatePipe.transform(this.todayDate.toDate(), 'D');
        this.todayDateInformation.month = await this.calendarService.getJalaliMonthName(
          jmoment(this.todayDate.toDate()).jMonth()
        );
        break;
    }
  }

  fillEvents() {
    this.calendarService.fillVisibleDates(this.todayDate, 'day').then(visibleDates => {
      this.calendarApiService.getEventsInPeriod(
        moment(this.todayDate).add(-1, 'days').set({h: 0, m: 0, s: 0}).format('YYYY-MM-DDTHH:mm:ss'),
        moment(this.todayDate).add(1, 'days').set({h: 0, m: 0, s: 0}).format('YYYY-MM-DDTHH:mm:ss'),
      ).subscribe(e => {
        const events = e.value.sevenTaskEvents;
        const totalEvents = [];
        events.forEach(event => {
          event.startTime = new Date(CalendarService.convertUtcToLocalTime(event.startTime, 'YYYY-MM-DDTHH:mm:ss'));
          event.endTime = new Date(CalendarService.convertUtcToLocalTime(event.endTime, 'YYYY-MM-DDTHH:mm:ss'));
        });
        const coveredEvents = [];
        totalEvents[0] = [];
        const relatedEvents = events.filter(e => (moment(e.startTime).format('YYYY-MM-DD') === visibleDates[0]
          .momentDate.format('YYYY-MM-DD') || moment(e.endTime).format('YYYY-MM-DD') === visibleDates[0]
          .momentDate.format('YYYY-MM-DD')));
          for (let counter = 0; counter < relatedEvents.length; counter++) {
            if (coveredEvents.indexOf(relatedEvents[counter]) === -1) {
              totalEvents[0][totalEvents[0].length] = relatedEvents[counter];
              coveredEvents.push(relatedEvents[counter]);
            }
        }
        this.rangeEvents = this.calendarService.getRangeWeekDayEvents(totalEvents, visibleDates,
            this.hourFieldHeight, this.eventCardMinimumHeight);
      });
    });
  }
}
