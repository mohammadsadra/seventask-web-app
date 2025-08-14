import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minuteToHour',
  pure: false
})
export class MinuteToHourPipe implements PipeTransform {

  transform(minute: number): any {
    minute = Math.trunc(minute);
    const h = minute / 60;
    const m = minute % 60;
    if (minute < 60) {
      if (localStorage.getItem('languageCode') === 'fa-IR') {
        return new Intl.NumberFormat('ar-SA', {}).format(Math.trunc(h)) + 'm ';
      } else {
        return new Intl.NumberFormat('en-IN', {}).format(Math.trunc(h)) + 'm ';
      }
    }
    if (localStorage.getItem('languageCode') === 'fa-IR') {
      return new Intl.NumberFormat('ar-SA', {}).format(Math.trunc(h)) + ' h ' + new Intl.NumberFormat('ar-SA', {}).format(Math.trunc(m)) + ' m ';
    } else {
      return new Intl.NumberFormat('en-IN', {}).format(Math.trunc(h)) + 'h ' + new Intl.NumberFormat('en-IN', {}).format(Math.trunc(m)) + 'm';
    }
  }

}
