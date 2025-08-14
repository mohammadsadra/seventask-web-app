import { Pipe, PipeTransform } from '@angular/core';
import { CalendarData, CalendarService } from '../services/calendarService/calendar.service';
import * as moment from 'moment';
import { CalendarTypeEnum } from '../enums/CalendarTypeEnum';
import { JalaliDatePipe } from './jalali-date.pipe';
import { TranslateService } from '@ngx-translate/core';
import { EnglishNumberToArabicNumberPipe } from './english-number-to-arabic-number.pipe';

@Pipe({
  name: 'seventaskDatePipe'
})
export class SeventaskDatePipePipe implements PipeTransform {

  calendarData: CalendarData;
  jalaliDatePipe = new JalaliDatePipe();
  numToArabicPipe = new EnglishNumberToArabicNumberPipe();

  constructor(private calendarService: CalendarService,
              private translateService: TranslateService) {
    this.calendarData = this.calendarService.getCalendarData();
  }

  async transform(date: Date, format: string = 'MMMM D, y') {    
    if (date) {
      switch (this.calendarData.firstCalendar) {
        case CalendarTypeEnum.JALALI:
          if (format === 'MMMM D, y') {
            return (await this.getJalaliMonthName(Number(this.jalaliDatePipe.transform(date, 'M')) - 1)) + ' ' +
              this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'D')) + ' , ' 
              + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'y'));
          }
          if (format === 'MMMM D, YYYY HH:mm') {
            return this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'D')) + ' ' +
            (await this.getJalaliMonthName(Number(this.jalaliDatePipe.transform(date, 'M')) - 1)) + ' '
            + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'YYYY')) + ' , '
            + this.convertEnglishNumberToArabic(moment(date).format('HH')) + ':' 
            + this.convertEnglishNumberToArabic(moment(date).format('mm'));
          }
          if (format === 'YYYY/M/D HH:mm') {
            return this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'YYYY')) + '/' 
            + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'M')) + '/' 
            + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'D')) + ' ' 
            + this.convertEnglishNumberToArabic(moment(date).format('HH')) + ':'
            + this.convertEnglishNumberToArabic(moment(date).format('mm'));
          }
          if (format === 'YYYY/M/D') {
            return this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'YYYY')) + '/' 
            + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'M')) + '/' 
            + this.convertEnglishNumberToArabic(this.jalaliDatePipe.transform(date, 'D'));
          }
          break;
        case CalendarTypeEnum.GEORGIAN:
          return moment(date).format(format).toString();
      }
    }
  }

  convertEnglishNumberToArabic(s: string) {
    const res = [];
    for (let i = 0; i < s.length; i++) {
      res.push(String(this.numToArabicPipe.transform(Number(s[i]))));
    }
    return res.join('');
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
}
