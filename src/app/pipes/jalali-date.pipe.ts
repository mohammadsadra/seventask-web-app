import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';

@Pipe({
  name: 'getJalaliDate',
})
export class JalaliDatePipe implements PipeTransform {
  transform(date: Date, format: string) {
    return jmoment(date).locale('fa').format(format);
  }
}
