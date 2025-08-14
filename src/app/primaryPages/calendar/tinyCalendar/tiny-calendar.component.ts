import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {CalendarData, CalendarDay, CalendarService} from '../../../services/calendarService/calendar.service';
import {EnglishNumberToArabicNumberPipe} from '../../../pipes/english-number-to-arabic-number.pipe';
import {CalendarTypeEnum} from '../../../enums/CalendarTypeEnum';
import {DirectionService} from '../../../services/directionService/direction.service';
import * as moment from 'moment';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import * as jmoment from 'jalali-moment';
import {EventModel} from '../../../DTOs/calendar/EventModel';
import { fadeInOutAnimation } from 'src/animations/animations';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { MatMenuTrigger } from '@angular/material/menu';
import { CalendarDataService } from 'src/app/services/dataService/calendarDataService/calendar-data.service';

@Component({
  selector: 'app-tiny-calendar',
  templateUrl: './tiny-calendar.component.html',
  styleUrls: ['./tiny-calendar.component.scss'],
  animations: [ fadeInOutAnimation ]
})
export class TinyCalendarComponent implements OnInit, OnChanges {

  calendarData: CalendarData;
  navIconRotateDegree = 0;
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();

  @Input() id = 0;
  @Input() navigatorOn = true;
  @Input() headerOn = true;
  @Input() selectorMode = false;
  @Input() showSecondCalendarData = false;
  @Input() showEvents = false;
  @Input() weekdays = [];
  @Input() showDayEvents: {id: number, selectedDate: moment.Moment} = null;
  @Input() defaultCurrentDate: moment.Moment = moment(new Date());
  @Input() defaultSelectedStartDate: moment.Moment = moment(new Date());
  @Input() defaultSelectedEndDate: moment.Moment = moment(new Date());
  @Input() events: EventResponseModel[][];
  @Input() enableRangeSelection: boolean = true;
  @Output() selectDates = new EventEmitter<moment.Moment[]>();
  @Output() selectEvent = new EventEmitter<[any, any]>();
  @Output() getVisibleDates = new EventEmitter<CalendarDay[]>();
  @Output() selectedDayToShowEvents = new EventEmitter<{id: number, selectedDate: moment.Moment}>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  visibleDates: CalendarDay[] = [];
  eventsList: EventResponseModel[][] = [[]];
  totalEvents: EventResponseModel[][]
  dayHasEvent: boolean[] = [];
  clickedOnDate = false;
  mainCalendarHeader = '';
  secondCalendarHeader = '';
  toSelectDate = '';
  selectedStartDate: moment.Moment = moment(new Date());
  selectedEndDate: moment.Moment = null;
  currentDate: moment.Moment = moment(new Date());
  todayDate = moment(new Date());
  isDragging = false;
  changeVisibleDates = false;
  gotDates = false;

  public get calendarType(): typeof CalendarTypeEnum {
    return CalendarTypeEnum;
  }

  constructor(private directionService: DirectionService,
              private calendarService: CalendarService,
              private calendarDataService: CalendarDataService) {
    this.calendarData = this.calendarService.getCalendarData();
    this.directionService.currentRotation.subscribe(async deg => {
      this.navIconRotateDegree = deg;
      this.weekdays = await this.calendarService.getWeekdays();
    });
  }

  ngOnInit(): void {
    // updating today each 1 minute.
    setTimeout( () => {
      this.todayDate = moment(new Date());  
      setInterval( () => {
        this.todayDate = moment(new Date());
      }, 60000);   
    }, 60000 - (this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));

    document.addEventListener('mouseup', () => {      
      if (this.isDragging || (!this.enableRangeSelection && this.clickedOnDate)) {
        this.toSelectDate = '';
        this.clickedOnDate = false;
        this.isDragging = false;
        this.selectDates.emit([this.selectedStartDate.local().startOf('day'), this.selectedEndDate.local().startOf('day')]); 
      }
    });
    this.calendarService.getWeekdays().then(weekdays => {
      this.weekdays = weekdays;
    });
    if (TextDirectionController.textDirection === 'rtl') {
      this.navIconRotateDegree = 180;
    }
    if (this.selectorMode) {
      if (this.defaultSelectedStartDate) {
        this.currentDate = moment(this.defaultSelectedStartDate).startOf('day');
      }
      this.selectedStartDate = moment(this.defaultSelectedStartDate.toDate());
      this.selectedEndDate = moment(this.defaultSelectedEndDate.toDate());
      this.selectedStartDate.startOf('day');
      this.selectedEndDate.startOf('day');
    }

    this.fillVisibleDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      if (changes.hasOwnProperty(property)) {
        const newValue = changes[property].currentValue;
        switch (property) {
          case 'defaultSelectedStartDate':
            this.selectedStartDate = moment(newValue);
            this.selectedStartDate.startOf('day');
            break;
          case 'defaultSelectedEndDate':
            this.selectedEndDate = moment(newValue);
            this.selectedEndDate.startOf('day');
            break;
          case 'defaultCurrentDate':
            this.currentDate = moment(newValue).startOf('day');
            this.fillVisibleDates();
            break;
          case 'events':
            this.totalEvents = newValue;
            this.fillVisibleDates();
            break;
        }
      }
    }
  }

  isSame(a: moment.Moment, b: moment.Moment) {
    return a.local().startOf('day').isSame(b.local().startOf('day'));
  }

  inRange(date: moment.Moment) {
    return date.local().startOf('day').isSameOrAfter(this.selectedStartDate) &&
           date.local().startOf('day').isSameOrBefore(this.selectedEndDate);
  }

  onHover(event: any, date: string) {
    if (this.selectorMode && !this.isDragging) {
      this.toSelectDate = date;
    }
  }

  onLeave(event: any) {
    if (this.selectorMode && !this.isDragging) {
      this.toSelectDate = '';
    }
  }

  onClick(event: any, date: moment.Moment) {
    if (this.showEvents && !this.selectorMode) {
      this.selectedDayToShowEvents.emit({
        id: this.id,
        selectedDate: date
      });
    }
  }

  mouseDown(event: any, date: moment.Moment) {
    if (this.selectorMode && !this.showEvents && !this.isDragging) {      
      this.selectedStartDate = moment(date);
      this.selectedEndDate = moment(date);
      this.clickedOnDate = true;
      this.isDragging = this.enableRangeSelection ? true : false;
    }
  }

  mouseOver(event: any, date: moment.Moment) {
    if (this.selectorMode && !this.showEvents && this.isDragging) {
      if (date.isSameOrAfter(this.selectedStartDate)) {
        this.selectedEndDate = moment(date);
      } else {
        this.selectedEndDate = moment(this.selectedStartDate);
      }
    }
  }

  addMonth(month: number) {
    this.currentDate = this.calendarService.addAmountToDate(this.currentDate, month, 'month');
    this.fillVisibleDates();
  }

  changeCurrentDays($event) {
    let calendarContainer = document.getElementById('calendar-container');
    
    if (this.selectorMode && this.isDragging && 
      $event.offsetX >= calendarContainer.clientWidth - 5 && 
      $event.offsetY >= 0 && $event.offsetY <= calendarContainer.clientHeight) {
        let isInCorrectPosition = true;
        let rightNav = document.getElementById('right-nav');
        rightNav.classList.add('blink');
        function removeBlink() {
          document.removeEventListener('mouseup', removeBlink);
          rightNav.classList.remove('blink');
        }
        document.addEventListener('mouseup', removeBlink);

        function canceledDrag(e) {          
          if (e.offsetX < calendarContainer.clientWidth) {
            isInCorrectPosition = false;
            rightNav.classList.remove('blink');
            calendarContainer.removeEventListener('mousemove', canceledDrag);
          }
        }
        calendarContainer.addEventListener('mousemove', canceledDrag);

        setTimeout(() => {
          if (this.isDragging && isInCorrectPosition) {
            rightNav.classList.remove('blink');
            this.addMonth(1);
          }
        }, 1500);
    } else if (this.selectorMode && this.isDragging && 
      $event.offsetX <= 15 && 
      $event.offsetY >= 0 && $event.offsetY <= calendarContainer.clientHeight &&
      this.selectedEndDate.startOf('day').diff(this.selectedStartDate.startOf('day'), 'month') > 0){ 
        let isInCorrectPosition = true;
        let leftNav = document.getElementById('left-nav');
        leftNav.classList.add('blink');
        function removeBlink() {
          document.removeEventListener('mouseup', removeBlink);
          leftNav.classList.remove('blink');
        }
        document.addEventListener('mouseup', removeBlink);
        
        function canceledDrag(e) {          
          if (e.offsetX > 15) {
            isInCorrectPosition = false;
            leftNav.classList.remove('blink');
            calendarContainer.removeEventListener('mousemove', canceledDrag);
          }
        }
        calendarContainer.addEventListener('mousemove', canceledDrag);

        setTimeout(() => {
          if (this.isDragging && isInCorrectPosition) {
            leftNav.classList.remove('blink');
            this.addMonth(-1);
          }
        }, 1500);
    }
  }

  async updateMonthName() {
    switch (this.calendarData.firstCalendar) {
      case CalendarTypeEnum.GEORGIAN:
        this.mainCalendarHeader = await this.calendarService.getMonthName(this.currentDate.month()) + ' ' +
          this.toArabicNumPipe.transform(this.currentDate.year());
        break;
      case CalendarTypeEnum.JALALI:
        this.mainCalendarHeader = await this.calendarService.getJalaliMonthName(jmoment(this.currentDate.toDate()).jMonth()) + ' ' +
          this.toArabicNumPipe.transform(jmoment(this.currentDate.toDate()).jYear());
        break;
    }
    if (this.calendarData.isSecondCalendarEnabled
      && this.calendarData.secondCalendar !== this.calendarData.firstCalendar) {
      switch (this.calendarData.secondCalendar) {
        case CalendarTypeEnum.GEORGIAN:
          const startOfCurrentJMonth = moment(
            jmoment(this.currentDate.toDate()).startOf('jmonth').toDate()
          );
          const endOfCurrentJMonth = moment(
            jmoment(this.currentDate.toDate()).endOf('jmonth').toDate()
          );
          this.secondCalendarHeader = `${await this.calendarService.getMonthName(
            startOfCurrentJMonth.month()
          )} - ${await this.calendarService.getMonthName(endOfCurrentJMonth.month())}`;
          break;
        case CalendarTypeEnum.JALALI:
          const startOfCurrentMonth = moment(this.currentDate).startOf(
            'month'
          );
          const endOfCurrentMonth = moment(this.currentDate).endOf('month');
          this.secondCalendarHeader = `${await this.calendarService.getJalaliMonthName(
            jmoment(startOfCurrentMonth.toDate()).jMonth()
          )} - ${await this.calendarService.getJalaliMonthName(
            jmoment(endOfCurrentMonth.toDate()).jMonth()
          )}`;
          break;
      }
    }
  }

  handleSelectedEvent($e, event) {
    $e.preventDefault();    
    this.selectEvent.emit([$e, event]);
  }

  sendSelectedEvent(event: EventResponseModel) {
    this.calendarDataService.selectEvent(event);
  }

  fillVisibleDates() {
    this.gotDates = false;
    this.eventsList = [];
    this.dayHasEvent = [];
    this.calendarService
      .fillVisibleDates(this.currentDate, 'month')
      .then(async (visibleDates: CalendarDay[]) => {
        if (this.visibleDates.length === 0 || !this.selectorMode) {
          this.gotDates = true;
          this.visibleDates = visibleDates;
        } else if (this.selectorMode) {
          setTimeout(() => {
            this.gotDates = true;
            this.visibleDates = visibleDates;
          }, 100);
        }
        this.weekdays = await this.calendarService.getWeekdays();
        this.getVisibleDates.emit(visibleDates);
        this.updateMonthName();
        if (this.showEvents) {
          let firstDayOfTheYear: moment.Moment;
          if (this.calendarData.firstCalendar === CalendarTypeEnum.GEORGIAN) {
            firstDayOfTheYear = moment(this.defaultCurrentDate).startOf('year');
          } else if (this.calendarData.firstCalendar === CalendarTypeEnum.JALALI) {
            firstDayOfTheYear = moment(
              jmoment(this.defaultCurrentDate.toDate()).startOf('jYear').toDate()
            );
          }
          firstDayOfTheYear.add(-1 * (firstDayOfTheYear.day() - this.calendarData.weekStartDay + 7) % 7, 'days');
          for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
            this.eventsList[dayIndex] = [];
            let temp = visibleDates[dayIndex].momentDate.diff(firstDayOfTheYear, 'days');
            if (temp >= 0 && temp <= this.totalEvents.length) {              
              this.eventsList[dayIndex] = this.totalEvents[temp];
            }
          }
          this.eventsList.forEach(events => {
            this.dayHasEvent.push(events && events.length != 0);
          });
        }
      });
  }
}
