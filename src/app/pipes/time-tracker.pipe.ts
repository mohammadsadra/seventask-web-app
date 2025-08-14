import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timeTracker',
})
export class TimeTrackerPipe implements PipeTransform {
  timeZone: number;
  today = this.datePipe.transform(new Date(), 'M/d/yy, h:mm:ss a');
  constructor(private datePipe: DatePipe) {
    this.timeZone = new Date().getTimezoneOffset() * -1 * 60 * 1000;
  }

  transform(value: any, theTime?: any, pastTime?: number, condition?: boolean) {
    if (condition) {
      return this.timeTrackProcess(pastTime * 60 * 1000);
    } else {
      this.today = this.datePipe.transform(new Date(), 'M/d/yy, h:mm:ss a');
      if (theTime !== null && pastTime === 0) {
        /*  */
        if (condition !== false) {
          const runningTime = new Date(Date.parse(theTime) + this.timeZone);
          return this.timeProcess(runningTime, 0);
        } else {
          return this.timeProcess(theTime, 0);
        }
      } else if (theTime !== null && pastTime > 0) {
        const pastnum = Math.trunc(pastTime * 60 * 1000);
        return this.timeProcess(theTime, pastnum);
      } else if (theTime === null && pastTime > 0) {
        const pastnum = Math.trunc(pastTime * 60 * 1000);
        const numTime = Date.parse(this.today) - this.timeZone - pastnum;
        const Timeresult = new Date(numTime);
        return this.timeProcess(Timeresult, 0);
      }
    }
  }
  /*  */
  timeProcess(theTime, pastTime) {
    const TimeValue = this.datePipe.transform(theTime, 'M/d/yy, h:mm:ss a');
    const TodayNum = Date.parse(this.today) + pastTime;
    const pastNum = Date.parse(TimeValue);
    const difference = (TodayNum - pastNum) / 1000 / 60 / 60;
    const h_result =
      Math.trunc(difference) < 10 && Math.trunc(difference) >= 0
        ? '0' + Math.trunc(difference)
        : Math.trunc(difference);
    const minutes = ((TodayNum - pastNum) / 1000 / 60) % 60;
    const m_result =
      Math.trunc(minutes) < 10 && Math.trunc(minutes) >= 0
        ? '0' + Math.trunc(minutes)
        : Math.trunc(minutes);
    const seconds = Math.trunc(((TodayNum - pastNum) / 1000) % 60);
    const s_resualt = seconds < 10 && seconds >= 0 ? '0' + seconds : seconds;
    return h_result + ':' + m_result + ':' + s_resualt;
  }

  /*  */

  timeTrackProcess(pastTime) {
    const difference = pastTime / 60 / 60 / 1000;
    const h_result =
      Math.trunc(difference) < 10 && Math.trunc(difference) >= 0
        ? '0' + Math.trunc(difference)
        : Math.trunc(difference);
    const minutes = Math.trunc((pastTime / 1000 / 60) % 60);
    const m_result =
      Math.trunc(minutes) < 10 && Math.trunc(minutes) >= 0
        ? '0' + Math.trunc(minutes)
        : Math.trunc(minutes);
    const seconds = Math.trunc((pastTime / 1000) % 60);
    const s_resualt = seconds < 10 && seconds >= 0 ? '0' + seconds : seconds;
    return h_result + ':' + m_result + ':' + s_resualt;
  }
}
