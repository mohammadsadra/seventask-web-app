import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NotificRunningTaskService {
  constructor(private http: HttpClient) {}

  private runningTask: Array<any> = [];

  getRunningTaskValue() {
    return this.runningTask;
  }

  setRunningTaskValue(value) {
    this.runningTask = value;
  }

  getNotificRunningTask(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Task/getRunningTasksWithDetails');
    } else {
      return this.http.get<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Task/getRunningTasksWithDetails'
      );
    }
  }
}
