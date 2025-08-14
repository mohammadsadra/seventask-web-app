import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeTrackDTO } from '../../DTOs//timeTrack/TimeTrackDTO';

@Injectable({
  providedIn: 'root',
})
export class TimeTrackService {
  constructor(private http: HttpClient) {}
  lastDate: any;
  lastRepeatDate: any;
  totalTrack: number;
  counter = 0;
  /* check for repetitive */
  getLastDate() {
    return this.lastDate;
  }
  setLastDate(value) {
    this.lastDate = value;
  }
  getLastRepeatDate() {
    return this.lastRepeatDate;
  }
  setLastRepeatDate(value) {
    this.lastRepeatDate = value;
  }
  getTotal() {
    return this.totalTrack;
  }
  setTotal(value) {
    this.totalTrack = value;
  }
  getCounter() {
    return this.counter;
  }
  setCounter(value: number) {
    this.counter = value;
  }
  /*  */

  getTimeTracks(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<TimeTrackDTO>('/en-US/Time/getTimeTracks');
    } else {
      return this.http.get<TimeTrackDTO>(
        '/' + localStorage.getItem('languageCode') + '/Time/getTimeTracks'
      );
    }
  }
  /* delete Time track */
  deleteTimeTrack(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete<any>('/en-US/Time/removeTimeTrack?id=' + id);
    } else {
      return this.http.delete<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Time/removeTimeTrack?id=' +
          id
      );
    }
  }
  /* Get workLod in priod */
  getWorkLoadInPeriod(start, end): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>(
        `/en-US/Time/getTeamsWorkLoadInPeriod?start=${start} &end=${end}`
      );
    } else {
      return this.http.get<any>(
        '/' +
          localStorage.getItem('languageCode') +
          `/Time/getTeamsWorkLoadInPeriod?start=${start} &end=${end}`
      );
    }
  }
  /* Get Time sheet Report */
  getTimesheetReport(teamId): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>(
        `/en-US/Time/getTimesheetReport?teamId=${teamId}`
      );
    } else {
      return this.http.get<any>(
        `/${localStorage.getItem(
          'languageCode'
        )}/Time/getTimesheetReport?teamId=${teamId}`
      );
    }
  }
  /*  */
  getTimesheet(teamId) {
    return this.http.get(
      `/${localStorage.getItem(
        'languageCode'
      )}/Time/getTimesheetReport?teamId=${teamId}`,
      {
        observe: 'response',
        responseType: 'blob',
      }
    );
  }
}
