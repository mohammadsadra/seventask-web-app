import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { EnglishNumberToArabicNumberPipe } from './/english-number-to-arabic-number.pipe';

@Pipe({
  name: 'manageDate',
})
export class ManageDatePipe implements PipeTransform {
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();

  transform(date: Date, format: string, locate: string, mainCal: string) {
    const local = locate.slice(0, 2);
    if (mainCal === 'JA') {
      if (locate === 'en-US') {
        if (format === 'MMMM') {
          return this.getEnName(jmoment(date).locale('fa').format('M'));
        } else if (format === 'ddd') {
          return moment(date).format(format);
        } else if (format === 'D') {
          return jmoment(date).locale('fa').format(format);
        } else {
          return jmoment(date).locale('fa').format(format);
        }
      } else if (locate === 'fa-IR') {
        if (format === 'MMMM') {
          return jmoment(date).locale('fa').format(format);
        } else if (format === 'ddd') {
          return moment(date).locale('fa').format(format);
        } else if (format === 'D') {
          return this.toArabicNumPipe.transform(
            Number(jmoment(date).locale('fa').format(format))
          );
        } else {
          return this.toArabicNumPipe.transform(
            Number(jmoment(date).locale(local).format(format))
          );
        }
      }
    } else if (mainCal === 'GE') {
      if (locate === 'en-US') {
        if (format === 'MMMM') {
          return moment(date).format(format);
        } else if (format === 'ddd') {
          return moment(date).format(format);
        } else if (format === 'D') {
          return Number(jmoment(date).locale('fa').format(format));
        } else {
          return moment(date).locale(local).format(format);
        }
      } else if (locate === 'fa-IR') {
        if (format === 'MMMM') {
          return moment(date).locale('fa').format(format);
        } else if (format === 'ddd') {
          return moment(date).locale('fa').format(format);
        } else if (format === 'D') {
          return Number(jmoment(date).locale('fa').format(format));
        } else {
          return moment(date).locale(local).format(format);
        }
      }
    } else {
      return moment(date).locale(local).format(format);
    }
  }

  getEnName(num) {
    switch (Number(num)) {
      case 1:
        return 'Farvardin';
        break;
      case 2:
        return 'Ordibehesht';
        break;
      case 3:
        return 'Khordad';
        break;
      case 4:
        return 'Tir';
        break;
      case 5:
        return 'Mordad';
        break;
      case 6:
        return 'Shahrivar';
        break;
      case 7:
        return 'Mehr';
        break;
      case 8:
        return 'Aban';
        break;
      case 9:
        return 'Azar';
        break;
      case 10:
        return 'Day';
        break;
      case 11:
        return 'Bahman';
        break;
      case 12:
        return 'Esfand';
        break;
    }
  }
}
