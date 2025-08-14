import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarTypeEnum } from 'src/app/enums/CalendarTypeEnum';
import { EnglishNumberToArabicNumberPipe } from './english-number-to-arabic-number.pipe';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { TimeTrackService } from 'src/app/services/timeTrackService/time-track.service';

@Pipe({
  name: 'trackerTimeDate',
})
export class TrackerTimeDatePipe implements PipeTransform {
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();
  constructor(private datePipe: DatePipe) {}
  transform(TimeValue: any) {
    const settings = SettingsService.getSettingsFromLocalStorage();
    const selectedCalendar = settings !== null ? settings.firstCalendar : null;
    if (TimeValue === '0' || TimeValue === 0) {
    } else {
      const Today = this.datePipe.transform(new Date(), 'M/d/yy');
      const TodayNum = Date.parse(Today);
      const pastNum = Date.parse(TimeValue);
      const faTimeValue = Date.parse(TimeValue);
      const difference = (TodayNum - pastNum) / 1000 / 60 / 60 / 24;
      if (Today === TimeValue) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Today' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'امروز' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy MMMM d')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'yyyy MMMMM d'))
          );
        } else {
          return (
            'Today' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference === 1) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Yesterday' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'دیروز' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            'Yesterday' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 2 && difference <= 6) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference) +
            ' days ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference)) +
            ' روز پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            Math.trunc(difference) +
            ' days ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 7 && difference <= 13) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Last week' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'هفته گذشته' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            'Last week' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 14 && difference <= 29) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference) +
            ' days ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference)) +
            ' روز پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            Math.trunc(difference) +
            ' days ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 30 && difference <= 59) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Last month' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'ماه گذشته' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            'Last month' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 60 && difference <= 364) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference / 30) +
            ' ' +
            'Month ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference / 30)) +
            ' ' +
            'ماه پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            Math.trunc(difference / 30) +
            ' ' +
            'Month ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      } else if (difference >= 365) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference / 365) +
            ' ' +
            'Year ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference / 365)) +
            ' ' +
            'سال پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('fa')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        } else {
          return (
            Math.trunc(difference / 365) +
            ' ' +
            'Year ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'dd  MMMM YYYY')
              : selectedCalendar === CalendarTypeEnum.JALALI
              ? jmoment(new Date(faTimeValue))
                  .locale('en')
                  .format('jDD  jMMMM  jYYYY')
              : this.datePipe.transform(TimeValue, 'dd  MMMM YYYY'))
          );
        }
      }
    }
  }
}

@Pipe({
  name: 'trackerTotal',
})
export class FuncPipeTrackerTotal implements PipeTransform {
  constructor(
    private datePipe: DatePipe,
    private timeTrackService: TimeTrackService
  ) {}
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();
  transform(totalArray: Array<any>) {
    const counter = this.timeTrackService.getCounter();
    if (counter === totalArray.length - 1) {
      this.timeTrackService.setCounter(0);
    } else {
      this.timeTrackService.setCounter(counter + 1);
    }
    return this.timeTrackProcess(totalArray[counter] * 1000 * 60);
  }

  /* functions */
  timeTrackProcess(pastTime) {
    const difference = pastTime / 60 / 60 / 1000;
    const h_result = Math.trunc(difference);
    const m_result = Math.trunc((pastTime / 1000 / 60) % 60);
    const s_resualt = Math.trunc((pastTime / 1000) % 60);
    if (localStorage.getItem('languageCode') === 'en-US') {
      return `${h_result}h    ${m_result}m    ${s_resualt}s`;
    } else if (localStorage.getItem('languageCode') === 'fa-IR') {
      return `${this.toArabicNumPipe.transform(
        s_resualt
      )} : ${this.toArabicNumPipe.transform(
        m_result
      )} : ${this.toArabicNumPipe.transform(h_result)}`;
    }
  }
}

@Pipe({
  name: 'checkTimeRepeat',
})
export class PipeCheckTimeRepeat implements PipeTransform {
  constructor(
    private datePipe: DatePipe,
    private timeTrackService: TimeTrackService
  ) {}
  transform(date: any, index: number, condition?: number) {
    const result = this.datePipe.transform(date, 'M/d/yy');
    const conditionCheck = condition === 1 ? true : false;
    console.log(
      `${condition} --- result = ${result} --- ${this.timeTrackService.getLastRepeatDate()}----- index = ${index}`
    );
    if (index === 0) {
      if (!conditionCheck) {
        this.timeTrackService.setLastRepeatDate(result);
      }
      return result;
    } else {
      const last = this.timeTrackService.getLastRepeatDate();
      if (result !== last) {
        if (!conditionCheck) {
          this.timeTrackService.setLastRepeatDate(result);
        }
        return result;
      }
    }
  }
}
