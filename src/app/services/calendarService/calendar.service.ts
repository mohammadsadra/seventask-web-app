import {Injectable} from '@angular/core';
import {CalendarTypeEnum} from '../../enums/CalendarTypeEnum';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from '../settingsService/settings.service';
import {MatDialog} from '@angular/material/dialog';
import {CalendarNewEventComponent} from '../../primaryPages/calendar/calendarNewEvent/calendar-new-event.component';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {EventModel} from '../../DTOs/calendar/EventModel';
import {EnglishNumberToArabicNumberPipe} from '../../pipes/english-number-to-arabic-number.pipe';
import {JalaliDatePipe} from '../../pipes/jalali-date.pipe';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { DatePipe } from '@angular/common';
import { ArbicNumberDatePipe } from 'src/app/pipes/arbic-number-date.pipe';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  calendarData: CalendarData = {
    weekStartDay: 0, // [0-6] and 0 is sunday
    firstCalendar: CalendarTypeEnum.GEORGIAN,
    secondCalendar: CalendarTypeEnum.JALALI,
    isSecondCalendarEnabled: false,
    weekends: [4, 5]
  };

  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();
  arabicNumPipe = new ArbicNumberDatePipe();
  jalaliDatePipe = new JalaliDatePipe();

  totalEvents: EventResponseModel[][] = [];

  selectedView = 'month';
  selectedDate = moment(new Date());

  public static convertUtcToLocalTime(date: Date, resultFormat: string) {
    return moment.utc(date).local().format(resultFormat);
  }


  public static convertMeridianTo24Format(hour: number, meridian: string) {
    const result = meridian === 'AM' ? hour : hour + 12;
    return hour === 12 ? result - 12 : result;
  }

  public static convert24FormatToMeridian(hour: number) {
    let result = hour > 12 ? hour - 12 : hour;
    result = hour === 0 ? 12 : result;
    return result;
  }

  constructor(public translateService: TranslateService,
              public dialog: MatDialog,
              public datePipe: DatePipe) {
    this.calendarData = this.getCalendarData();
    if (localStorage.getItem('calendarData')) {
      const data = JSON.parse(localStorage.getItem('calendarData'));
      this.selectedView = data.selectedView;
      this.selectedDate = moment(data.selectedDate);
    }
    this.checkLastTime();
  }

  async getDateString(date: moment.Moment, format: string = 'MMMM D, y') {
    switch (this.calendarData.firstCalendar) {
      case CalendarTypeEnum.JALALI:
        if (format === 'MMMM D, y') {
          return await this.getJalaliMonthName(Number(this.jalaliDatePipe.transform(date.toDate(), 'M')) - 1).catch() + ' ' +
            this.jalaliDatePipe.transform(date.toDate(), 'D') + ', ' + this.jalaliDatePipe.transform(date.toDate(), 'y');
        }
        if (format === 'MMMM D, YYYY HH:mm') {
          return await this.getJalaliMonthName(Number(this.jalaliDatePipe.transform(date.toDate(), 'M')) - 1).catch() + ' ' +
          this.jalaliDatePipe.transform(date.toDate(), 'D') + ', ' + this.jalaliDatePipe.transform(date.toDate(), 'YYYY') + ' ' + date.format('HH:mm');
        }
        if (format === 'YYYY/M/D HH:mm') {
          return await this.jalaliDatePipe.transform(date.toDate(), 'YYYY') + '/' + this.jalaliDatePipe.transform(date.toDate(), 'M') + '/' +
          this.jalaliDatePipe.transform(date.toDate(), 'D') + ' ' + date.format('HH:mm');
        }
        if (format === 'YYYY/M/D') {
          return await this.jalaliDatePipe.transform(date.toDate(), 'YYYY') + '/' + this.jalaliDatePipe.transform(date.toDate(), 'M') + '/' +
          this.jalaliDatePipe.transform(date.toDate(), 'D');
        }
        break;
      case CalendarTypeEnum.GEORGIAN:
        return date.format(format).toString();
    }
  }

  getCalendarData() {
    const settingsData = SettingsService.getSettingsFromLocalStorage();

    if (settingsData) {
      this.calendarData.weekStartDay = settingsData.firstWeekDay - 1;
      this.calendarData.firstCalendar = settingsData.firstCalendar;
      if (settingsData.isSeondCalendarOn && settingsData.secondCalendar) {
        this.calendarData.isSecondCalendarEnabled = settingsData.isSeondCalendarOn;
        this.calendarData.secondCalendar = settingsData.secondCalendar;
      } else {
        this.calendarData.isSecondCalendarEnabled = false;
      }
      this.calendarData.weekends = settingsData.weekends;
      this.calendarData.weekends = this.calendarData.weekends.map(day => day - 1);
    }
    return this.calendarData;
  }

  public getDateNumber(date: Date) {
    switch(this.getCalendarData().firstCalendar) {
      case CalendarTypeEnum.GEORGIAN:
        return this.datePipe.transform(date, 'd');
      case CalendarTypeEnum.JALALI:
        return this.arabicNumPipe.transform(this.jalaliDatePipe.transform(date, 'D'));
    }
  }

  getEachDayEvents(events: EventResponseModel[], visibleDates: CalendarDay[], localize=true): EventResponseModel[][] {
    this.totalEvents = [];
    if (localize) {
      events.forEach(event => {
        event.startTime = new Date(CalendarService.convertUtcToLocalTime(event.startTime, 'YYYY-MM-DDTHH:mm:ss'));
        event.endTime = new Date(CalendarService.convertUtcToLocalTime(event.endTime, 'YYYY-MM-DDTHH:mm:ss'));
      });
    }
    let coveredEvents = [];

    if (this.getSelectedView() !== 'year') {
      for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
        this.totalEvents[dayIndex] = [];
        const relatedEvents = events.filter(e => (moment(e.startTime).format('YYYY-MM-DD') === visibleDates[dayIndex]
          .momentDate.format('YYYY-MM-DD') || moment(e.endTime).format('YYYY-MM-DD') === visibleDates[dayIndex]
          .momentDate.format('YYYY-MM-DD')));            
          for (let counter = 0; counter < relatedEvents.length; counter++) {
            if (coveredEvents.indexOf(relatedEvents[counter]) === -1) {
              this.totalEvents[dayIndex][this.totalEvents[dayIndex].length] = relatedEvents[counter];
              coveredEvents.push(relatedEvents[counter]);
            }
        }
      }
      const remainingEvents = events.filter(e => coveredEvents.indexOf(e) === -1
                                            && moment(e.startTime).isSameOrBefore(visibleDates[0].momentDate)
                                            && moment(e.endTime).isSameOrAfter(visibleDates[visibleDates.length - 1].momentDate));      
      for (let remainingEvent of remainingEvents) {
        this.totalEvents[0][this.totalEvents[0].length] = remainingEvent;
      }      
    } else {
      let startDate = moment(visibleDates[0].momentDate);
      let endDate = moment(visibleDates[2].momentDate);
      
      while (startDate.diff(endDate, 'days') != 0) {
        this.totalEvents.push([]);
        startDate.add(1, 'days');
      }
      this.totalEvents.push([]);

      for (let event of events) {
        if (moment(event.startTime).diff(visibleDates[0].momentDate, 'days') >= 0) {
          this.totalEvents[moment(event.startTime).diff(visibleDates[0].momentDate, 'days')].push(event);
        }
      }
    }
    return this.totalEvents;
  }

  getMainCalendarType() {
    return this.calendarData.firstCalendar;
  }

  updateCalendarDataInLocalStorage() {
    localStorage.setItem('calendarData', JSON.stringify({
      selectedView: this.selectedView,
      selectedDate: this.selectedDate,
      lastTime: new Date()
    }));
  }

  checkLastTime() { 
    const data = JSON.parse(localStorage.getItem('calendarData'));
    if (!data || !data.lastTime || moment(new Date()).diff(moment(data.lastTime), 'minutes') > 60) {      
      this.setSelectedDate(moment(new Date()));
    }
  }

  getSelectedView() {
    this.updateCalendarDataInLocalStorage();
    return this.selectedView;
  }

  setView(view: string) {
    this.selectedView = view;
    this.updateCalendarDataInLocalStorage();
  }

  getSelectedDate() {
    this.checkLastTime();
    this.updateCalendarDataInLocalStorage();
    return this.selectedDate;
  }

  setSelectedDate(selectedDate: moment.Moment) {
    this.selectedDate = selectedDate;
    this.updateCalendarDataInLocalStorage();
  }

  async getWeekdays() {
    const weekDays = [
      new Weekday(await this.translateService.get('Calendar.WeekDays.sun').toPromise(), 0, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.mon').toPromise(), 1, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.tue').toPromise(), 2, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.wed').toPromise(), 3, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.thu').toPromise(), 4, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.fri').toPromise(), 5, this.calendarData.weekStartDay),
      new Weekday(await this.translateService.get('Calendar.WeekDays.sat').toPromise(), 6, this.calendarData.weekStartDay)
    ];
    for (let staringDayIndex = this.calendarData.weekStartDay; staringDayIndex > 0; staringDayIndex--) {
      weekDays.push(weekDays.shift());
    }
    return weekDays;
  }

  async getDayHours() {
    const am = await this.translateService.get('Calendar.am').toPromise();
    const pm = await this.translateService.get('Calendar.pm').toPromise();

    return [
      String(this.toArabicNumPipe.transform(12)) + ' ' + am,
      this.toArabicNumPipe.transform(1) + ' ' + am,
      this.toArabicNumPipe.transform(2) + ' ' + am,
      this.toArabicNumPipe.transform(3) + ' ' + am,
      this.toArabicNumPipe.transform(4) + ' ' + am,
      this.toArabicNumPipe.transform(5) + ' ' + am,
      this.toArabicNumPipe.transform(6) + ' ' + am,
      this.toArabicNumPipe.transform(7) + ' ' + am,
      this.toArabicNumPipe.transform(8) + ' ' + am,
      this.toArabicNumPipe.transform(9) + ' ' + am,
      this.toArabicNumPipe.transform(10) + ' ' + am,
      this.toArabicNumPipe.transform(11) + ' ' + am,
      this.toArabicNumPipe.transform(12) + ' ' + pm,
      this.toArabicNumPipe.transform(1) + ' ' + pm,
      this.toArabicNumPipe.transform(2) + ' ' + pm,
      this.toArabicNumPipe.transform(3) + ' ' + pm,
      this.toArabicNumPipe.transform(4) + ' ' + pm,
      this.toArabicNumPipe.transform(5) + ' ' + pm,
      this.toArabicNumPipe.transform(6) + ' ' + pm,
      this.toArabicNumPipe.transform(7) + ' ' + pm,
      this.toArabicNumPipe.transform(8) + ' ' + pm,
      this.toArabicNumPipe.transform(9) + ' ' + pm,
      this.toArabicNumPipe.transform(10) + ' ' + pm,
      this.toArabicNumPipe.transform(11) + ' ' + pm,
    ];
  }

  async fillVisibleDates(selectedDate, selectedView): Promise<CalendarDay[]> {
    let startOfView;
    let endOfView;
    const visibleDates = [];
    const copyOfSelectedView = selectedView;
    if (this.calendarData.firstCalendar === CalendarTypeEnum.GEORGIAN) {
      startOfView = moment(selectedDate).startOf(selectedView);
      endOfView = moment(selectedDate).endOf(selectedView);
    } else if (this.calendarData.firstCalendar === CalendarTypeEnum.JALALI) {
      selectedView = 'j' + selectedView;
      startOfView = moment(
        jmoment(selectedDate.toDate()).startOf(selectedView).toDate()
      );
      endOfView = moment(
        jmoment(selectedDate.toDate()).endOf(selectedView).toDate()
      );
    }
    switch (copyOfSelectedView) {
      case 'day':
        visibleDates.push(new CalendarDay(moment(startOfView), true));
        break;
      case 'week':
        startOfView = moment(selectedDate);
        while (startOfView.day() !== this.calendarData.weekStartDay) {
          visibleDates.unshift(new CalendarDay(moment(startOfView), true));
          startOfView.add(-1, 'day');
        }
        visibleDates.unshift(new CalendarDay(moment(startOfView), true));
        startOfView = moment(selectedDate).add(1, 'day');
        while (visibleDates.length !== 7) {
          visibleDates.push(new CalendarDay(moment(startOfView), true));
          startOfView.add(1, 'day');
        }
        break;
      case 'month':      
        const monthStartOffset = (startOfView.day() - this.calendarData.weekStartDay + 7) % 7;
        //region: fill previous month days
        let copyStartDate = moment(startOfView).startOf('day');
        for (let dayDiff = monthStartOffset; dayDiff >= 1; dayDiff--) {
          const tempDate = new CalendarDay(
            moment(copyStartDate.add(-1, 'day').startOf('day')),
            false
          );
          visibleDates.unshift(tempDate);
        }
        //endregion
        //region: fill current month days
        copyStartDate = moment(startOfView).startOf('day');
        visibleDates.push(new CalendarDay(startOfView.startOf('day'), true));
        for (
          let dayNumber = 1;
          dayNumber <= endOfView.diff(startOfView, 'days');
          dayNumber++
        ) {
          const tempDate = new CalendarDay(
            moment(copyStartDate.add(1, 'day').startOf('day')),
            true
          );
          visibleDates.push(tempDate);
        }
        //endregion
        //region: fill next month days (6 rows of weekdays)
        const monthEndOffset = 6 * 7 - visibleDates.length;
        copyStartDate = moment(endOfView);
        for (let dayDiff = 1; dayDiff <= monthEndOffset; dayDiff++) {
          const tempDate = new CalendarDay(
            moment(copyStartDate.add(1, 'day').startOf('day')),
            false
          );
          visibleDates.push(tempDate);
        }        
        //endregion
        break;
      case 'year':
        let copyOfView = moment(startOfView);
        copyOfView.add(-1 * (copyOfView.day() - this.calendarData.weekStartDay + 7) % 7, 'days');
        visibleDates.push(new CalendarDay(moment(copyOfView), true));

        visibleDates.push(new CalendarDay(moment(startOfView), true));

        copyOfView = moment(endOfView).add(20, 'days');       
        visibleDates.push(new CalendarDay(moment(copyOfView), true)); 
        break;
    }
    return visibleDates;
  }

  async getMonthName(monthNumber: number) {
    let monthName = '';
    switch (monthNumber) {
      case 0:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.January')
          .toPromise();
        break;
      case 1:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.February')
          .toPromise();
        break;
      case 2:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.March')
          .toPromise();
        break;
      case 3:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.April')
          .toPromise();
        break;
      case 4:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.May')
          .toPromise();
        break;
      case 5:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.June')
          .toPromise();
        break;
      case 6:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.July')
          .toPromise();
        break;
      case 7:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.August')
          .toPromise();
        break;
      case 8:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.September')
          .toPromise();
        break;
      case 9:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.October')
          .toPromise();
        break;
      case 10:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.November')
          .toPromise();
        break;
      case 11:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Georgian.December')
          .toPromise();
        break;
    }
    return monthName;
  }

  async getJalaliMonthName(monthNumber: number) {
    let monthName = '';
    switch (monthNumber) {
      case 0:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Farvardin')
          .toPromise();
        break;
      case 1:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Ordibehesht')
          .toPromise();
        break;
      case 2:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Khordad')
          .toPromise();
        break;
      case 3:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Tir')
          .toPromise();
        break;
      case 4:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Mordad')
          .toPromise();
        break;
      case 5:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Shahrivar')
          .toPromise();
        break;
      case 6:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Mehr')
          .toPromise();
        break;
      case 7:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Aban')
          .toPromise();
        break;
      case 8:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Azar')
          .toPromise();
        break;
      case 9:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Dey')
          .toPromise();
        break;
      case 10:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Bahman')
          .toPromise();
        break;
      case 11:
        monthName = await this.translateService
          .get('Calendar.MonthNames.Jalali.Esfand')
          .toPromise();
        break;
    }
    return monthName;
  }

  addAmountToDate(date: moment.Moment, amount: number, unit) {
    let temp = moment(date);
    switch (this.calendarData.firstCalendar) {
      case CalendarTypeEnum.GEORGIAN:
        temp.add(amount, unit);
        break;
      case CalendarTypeEnum.JALALI:
        unit = 'j' + unit;
        temp = moment(jmoment(date.toDate()).add(amount, unit).toDate());
        break;
    }
    return temp;
  }

  createNewEvent(date: Date) {
     return this.dialog.open(CalendarNewEventComponent, {
      data: {
        startTime: date,
        endTime: date,
      },
      direction: TextDirectionController.textDirection === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  computeOffset(startTime: Date, dayFieldHeight: number) {
    return startTime.getMinutes() * dayFieldHeight / 60 + startTime.getHours() * dayFieldHeight;
  }

  computeLength(startTime: Date, endTime: Date, isStarting: boolean, isEnding: boolean, dayFieldHeight: number, eventCardMinimumHeight: number) {
    let length = 0;
    if (isStarting && isEnding) {
      length = ((endTime.getTime() - startTime.getTime()) / (60 * 1000)) * dayFieldHeight / 60;
      length = length < eventCardMinimumHeight ? 0.65 * eventCardMinimumHeight : length;
    }
    if (!isStarting && isEnding) {
      length = endTime.getMinutes() * dayFieldHeight / 60 + endTime.getHours() * dayFieldHeight;
    }
    if (isStarting && !isEnding) {
      length = (60 - startTime.getMinutes()) * dayFieldHeight / 60 + (23 - startTime.getHours()) * dayFieldHeight;
    }
    if (!isStarting && !isEnding) {
      length = 24 * dayFieldHeight;
    }
    return length;
  }

  // Computing width based on days.
  computeWidth(startTime: Date, endTime: Date) {
    return (moment(endTime).startOf('day').diff(moment(startTime).startOf('day'), 'days') + 1);
  }

  isSameDate(firstDate: Date, secondDate: Date) {    
    return moment(firstDate).format('YYYY-MM-DD') == moment(secondDate).format('YYYY-MM-DD');
  }

  getRangeWeekDayEvents(eventsListBasedOnDay, visibleDates, dayFieldHeight: number, eventCardMinimumHeight: number) {
    const dayRangeEvents: RangeEvent[][] = [];
    const totalEvents: EventResponseModel[][] = [];
    let coveredEvents = [];
        
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      totalEvents[dayIndex] = [];
      dayRangeEvents[dayIndex] = [];
      for (let event of eventsListBasedOnDay[dayIndex]) {
        totalEvents[dayIndex].push(event);
      }
    }    
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      for (let eventIndex = 0; eventIndex < totalEvents[dayIndex].length; eventIndex++) {
        let event = totalEvents[dayIndex][eventIndex];
        let isStarting = this.isSameDate(event.startTime, visibleDates[dayIndex].momentDate.toDate());
        let isEnding = this.isSameDate(event.endTime, visibleDates[dayIndex].momentDate.toDate());
        
        if (isStarting && coveredEvents.indexOf(event) === -1) {
          dayRangeEvents[dayIndex].push(
            new RangeEvent(
              true,
              isEnding,
              this.computeOffset(event.startTime, dayFieldHeight),
              0,
              this.computeLength(event.startTime, event.endTime, true, isEnding, dayFieldHeight, eventCardMinimumHeight),
              100,
              event
            )
          );
          if (isEnding) {
            let addedEvent = dayRangeEvents[dayIndex][dayRangeEvents[dayIndex].length-1];
            addedEvent.yOffset = addedEvent.yOffset + addedEvent.length > 24 * dayFieldHeight ? 
            (24 * dayFieldHeight - addedEvent.length): addedEvent.yOffset;
          }
          if (!isEnding) {
            let currentDay = dayIndex + 1;
            while (currentDay < visibleDates.length && !this.isSameDate(event.endTime, visibleDates[currentDay].momentDate.toDate())) {
              dayRangeEvents[currentDay].push(
                new RangeEvent(
                  false,
                  false,
                  0,
                  0,
                  this.computeLength(event.startTime, event.endTime, false, false, dayFieldHeight, eventCardMinimumHeight),
                  100,
                  event
                )
              );
              currentDay++;
            }
            if (currentDay < visibleDates.length) {
              if (this.isSameDate(event.endTime, visibleDates[currentDay].momentDate.toDate())) {
                dayRangeEvents[currentDay].push(
                  new RangeEvent(
                    false,
                    true,
                    0,
                    0,
                    this.computeLength(event.startTime, event.endTime, false, true, dayFieldHeight, eventCardMinimumHeight),
                    100,
                    event
                  )
                );
              }
            }
          }
          coveredEvents.push(event);
        }
        if (isEnding && coveredEvents.indexOf(event) === -1) {
          dayRangeEvents[dayIndex].push(
            new RangeEvent(
              false,
              true,
              0,
              0,
              this.computeLength(event.startTime, event.endTime, false, true, dayFieldHeight, eventCardMinimumHeight),
              100,
              event
            )
          );
          let currentDay = dayIndex - 1;
          while (currentDay >= 0) {
            dayRangeEvents[currentDay].push(
              new RangeEvent(
                false,
                false,
                0,
                0,
                this.computeLength(event.startTime, event.endTime, false, false, dayFieldHeight, eventCardMinimumHeight),
                100,
                event
              )
            );
            currentDay--;
          }
          coveredEvents.push(event);
        } else if (!isStarting && !isEnding && coveredEvents.indexOf(event) === -1) {
          for (let day = dayIndex; day < visibleDates.length; day++) {
            dayRangeEvents[day].push(
              new RangeEvent(
                false,
                false,
                0,
                0,
                this.computeLength(event.startTime, event.endTime, false, false, dayFieldHeight, eventCardMinimumHeight),
                100,
                event
              )
            );
          }
          coveredEvents.push(event);
        }
      }
    }

    coveredEvents = [];
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      dayRangeEvents[dayIndex].sort((a, b) => (a.length + a.yOffset < b.length + b.yOffset) ? 1:
      ((a.length + a.yOffset > b.length + b.yOffset) ? -1 : 0))
    }
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      coveredEvents = [];
      for (let eventIndex = 0; eventIndex < dayRangeEvents[dayIndex].length; eventIndex++) {
        let overridingEventsBasedOnIndex = [eventIndex];
        let firstEvent = dayRangeEvents[dayIndex][eventIndex];
        if (coveredEvents.indexOf(firstEvent.event) === -1) {
          for (let otherEvent = 0; otherEvent < dayRangeEvents[dayIndex].length; otherEvent++) {
            let secondEvent = dayRangeEvents[dayIndex][otherEvent];
            if (coveredEvents.indexOf(secondEvent.event) === -1 &&
              eventIndex !== otherEvent && (
              Math.abs(firstEvent.yOffset - secondEvent.yOffset) < eventCardMinimumHeight
            )) {
              overridingEventsBasedOnIndex.push(otherEvent);
            }
          }
          for (let index of overridingEventsBasedOnIndex) {
            let rangeEvent = dayRangeEvents[dayIndex][index];
            coveredEvents.push(rangeEvent.event);
            rangeEvent.width /= overridingEventsBasedOnIndex.length;
            rangeEvent.xOffset = rangeEvent.width * (overridingEventsBasedOnIndex.indexOf(index));
          }
        }
      }
    }
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      dayRangeEvents[dayIndex].sort((a, b) => a.yOffset - b.yOffset);
    }    
    return dayRangeEvents;
  }

  getMonthEvents(eventsListBasedOnDay, visibleDates, eventDivHeight: number): MonthEvent[][] {
    const monthEvents: MonthEvent[][] = [];
    const tempEvents: EventResponseModel[] = [];
    const totalEvents: EventResponseModel[][] = [];
    
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      monthEvents[dayIndex] = [];
      totalEvents[dayIndex] = [];
      for (let event of eventsListBasedOnDay[dayIndex]) {        
        tempEvents.push(event);
        totalEvents[dayIndex].push(event);
      }
    }

    for (let weekStart = 0; weekStart < visibleDates.length; weekStart += 7) {
      for (let event of tempEvents) {
        if (!totalEvents[weekStart].includes(event)
            && moment(event.startTime).diff(visibleDates[weekStart].momentDate.startOf('day')) <= 0
            && moment(event.endTime).diff(visibleDates[weekStart].momentDate.startOf('day')) >= 0) {
          totalEvents[weekStart].push(event);
        }
      }
    }

    totalEvents.forEach((_, index) => {
      totalEvents[index].sort((a, b) => (b.endTime.getTime() - visibleDates[index].momentDate.toDate().getTime()) - (a.endTime.getTime() - visibleDates[index].momentDate.toDate().getTime()));
    });

    for (let weekStart = 0; weekStart < visibleDates.length; weekStart += 7) {
      let coveredEvents = [];
      let yOffsets = [];
      for (let dayIndex = weekStart; dayIndex < weekStart + 7; dayIndex++) {
        for (let event of totalEvents[dayIndex]) {
          if (!coveredEvents.includes(event)) {
            let eventYOffset = 0;
            let eventXOffset = this.isSameDate(event.startTime, visibleDates[dayIndex].momentDate) ? 0 : -3;
            for (let tempEvent of coveredEvents) {
              if (moment(tempEvent.endTime).startOf('day').diff(moment(event.startTime).startOf('day'), 'days') >= 0) {
                const tempEventId = tempEvent.id === -1 ? tempEvent.googleCalendarEventId : tempEvent.id;
                eventYOffset = Math.max(eventDivHeight, yOffsets[tempEventId] + eventDivHeight) + 1
              }
            }
            monthEvents[dayIndex].push(
              new MonthEvent(event, 
                TextDirectionController.textDirection === 'ltr' ? eventXOffset : null, 
                TextDirectionController.textDirection === 'rtl' ? eventXOffset : null,
                eventYOffset, this.computeWidth(visibleDates[dayIndex].momentDate.toDate(), event.endTime) * 100, eventDivHeight)
            );
            coveredEvents.push(event);

            const eventId = event.id === -1 ? event.googleCalendarEventId : event.id;
            yOffsets[eventId] = eventYOffset;
          }
        }
      }
    }
    return monthEvents;
  }

  getAllDayEvents(eventsListBasedOnDay, visibleDates, eventDivHeight: number): AllDayEvent[][] {
    const allDayEvents: AllDayEvent[][] = [];
    const totalEvents: EventResponseModel[][] = [];
    const coveredEvents: EventResponseModel[] = [];
    const yOffsets = {};
    
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      totalEvents[dayIndex] = [];
      allDayEvents[dayIndex] = [];
      for (let event of eventsListBasedOnDay[dayIndex]) {        
        if (event.isAllDay) {
          totalEvents[dayIndex].push(event);
          if (visibleDates[0].momentDate.diff(event.startTime) >= 0) {
            totalEvents[0].push(event);
          }
        }
      }
    }

    totalEvents.forEach((_, index) => {
      totalEvents[index].sort((a, b) => (b.endTime.getTime() - visibleDates[index].momentDate.toDate().getTime()) -  (a.endTime.getTime() - visibleDates[index].momentDate.toDate().getTime()));
    });

    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      for (let event of totalEvents[dayIndex]) {        
        if (!coveredEvents.includes(event)) {
          let eventYOffset = 0;
          let eventXOffset = this.isSameDate(event.startTime, visibleDates[dayIndex].momentDate) ? 0 : -3;
          for (let tempEvent of coveredEvents) {                     
            if (moment(tempEvent.endTime).startOf('day').diff(moment(event.startTime).startOf('day'), 'days') >= 0) {
              const tempEventId = tempEvent.id === -1 ? tempEvent.googleCalendarEventId : tempEvent.id;
              eventYOffset = Math.max(eventDivHeight, yOffsets[tempEventId] + eventDivHeight) + 1
            }
          }
          allDayEvents[dayIndex].push(
            new AllDayEvent(event, 
              TextDirectionController.textDirection === 'ltr' ? eventXOffset : null, 
              TextDirectionController.textDirection === 'rtl' ? eventXOffset : null,
              eventYOffset, this.computeWidth(visibleDates[dayIndex].momentDate.toDate(), event.endTime) * 100, eventDivHeight)
          );
          coveredEvents.push(event);
          
          const eventId = event.id === -1 ? event.googleCalendarEventId : event.id;
          yOffsets[eventId] = eventYOffset;
        }
      }
    }
    return allDayEvents;
  }

  getFullEventsOfEachDay(eventsListBasedOnDay, visibleDates, eventDivHeight: number): MonthEvent[][] {
    const resultEvents: MonthEvent[][] = [];
    const totalEvents: EventResponseModel[] = [];
    
    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      resultEvents[dayIndex] = [];
      for (let event of eventsListBasedOnDay[dayIndex]) {        
        totalEvents.push(event);
      }
    }

    for (let dayIndex = 0; dayIndex < visibleDates.length; dayIndex++) {
      let yOffset = 0;
      for (let event of totalEvents) {
        if (visibleDates[dayIndex].momentDate.startOf('day').isSameOrAfter(moment(event.startTime).startOf('day')) &&
            visibleDates[dayIndex].momentDate.startOf('day').isSameOrBefore(moment(event.endTime).startOf('day'))) {
          resultEvents[dayIndex].push(
            new MonthEvent(event, null, null, yOffset, 100, eventDivHeight)
          );
          yOffset += eventDivHeight + 1;
        }
      }
    }

    return resultEvents;
  }

  getUpdatedAllDaySection(allDayEvents: AllDayEvent[][], defaultHeight: number) {
    let maximumOffset = 0;
    for (let events of allDayEvents) {
      for (let event of events) {        
        maximumOffset = Math.max(maximumOffset, Math.floor(event.yOffset / event.height) * event.height + event.height + Math.floor(event.yOffset / event.height) - 1);
      }
    }    
    return Math.max(defaultHeight, maximumOffset);
  }

  isFieldOverflowed(events: MonthEvent[], fieldHeight: number, eventHeight: number): boolean {
    let maximumOffset = 0;
    for (let event of events) {
      maximumOffset = Math.max(maximumOffset, Math.floor(event.yOffset / event.height) * event.height + event.height + Math.floor(event.yOffset / event.height) - 1);
    }
    return maximumOffset + eventHeight + 1 > fieldHeight;
  }
}

export class CalendarData {
  public weekStartDay: number;
  public firstCalendar: number;
  public secondCalendar: number;
  public isSecondCalendarEnabled: boolean;
  public weekends: number[];

  constructor(weekStartDay: number, firstCalendar: number, secondCalendar: number, isSecondCalendarEnabled: boolean, weekends: number[]) {
    this.weekStartDay = weekStartDay;
    this.firstCalendar = firstCalendar;
    this.secondCalendar = secondCalendar;
    this.isSecondCalendarEnabled = isSecondCalendarEnabled;
    this.weekends = weekends;
  }
}

export class Weekday {
  public abbr: string;
  public defaultIndex: number;
  public order: number;

  constructor(abbr: string, defaultIndex: number, weekStartDayIndex: number) {
    this.abbr = abbr;
    this.defaultIndex = defaultIndex;
    this.order = (defaultIndex - weekStartDayIndex + 7) % 7;
  }
}

export class CalendarDay {
  public momentDate: moment.Moment;
  public hasMainStyle: boolean;

  constructor(momentDate: moment.Moment, hasMainStyle: boolean) {
    this.momentDate = momentDate;
    this.hasMainStyle = hasMainStyle;
  }
}

export class AllDayEvent {
  // width is in percent
  // height is in pixels
  public event: EventResponseModel;
  public left: number;
  public right: number;
  public yOffset: number;
  public width: number;
  public height: number;

  constructor(event: EventResponseModel, left: number, right: number, yOffset: number, width: number, height: number) {
    this.event = event;
    this.left = left;
    this.right = right;
    this.yOffset = yOffset;
    this.width = width;
    this.height = height;
  }
}

export class MonthEvent extends AllDayEvent {
  public singleDay: boolean;

  constructor(event: EventResponseModel, left: number, right: number, yOffset: number, width: number, height: number) {
    super(event, left, right, yOffset, width, height);
    this.singleDay = moment(event.startTime).startOf('day').diff(moment(event.endTime).startOf('day'), 'day') === 0 && !event.isAllDay;
  }
}

export class RangeEvent {
  public isStartingAtCurrentDay: boolean;
  public isEndingAtCurrentDay: boolean;
  public yOffset: number;
  public xOffset: number;
  public length: number;
  public width: number;
  public event: EventResponseModel;

  constructor(
    isStartingAtCurrentDay: boolean,
    isEndingAtCurrentDay: boolean,
    yOffset: number,
    xOffset: number,
    length: number,
    width: number,
    event: EventResponseModel
  ) {
    this.isStartingAtCurrentDay = isStartingAtCurrentDay;
    this.isEndingAtCurrentDay = isEndingAtCurrentDay;
    this.yOffset = yOffset;
    this.xOffset = xOffset;
    this.length = length;
    this.width = width;
    this.event = event;
  }
}