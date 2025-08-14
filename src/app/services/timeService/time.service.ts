import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GeneralTaskPostDTO} from '../../DTOs/kanban/GeneralTaskPostDTO';
import {Observable} from 'rxjs';
import {CreateTaskResponseModel} from '../../DTOs/responseModel/CreateTaskResponseModel';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor(private http: HttpClient) {
  }

  start(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Time/start?taskId=' + taskId, null);
    } else {
      return this.http.post<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/start?taskId=' +
        taskId,
        null
      );
    }
  }

  stop(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Time/stop?taskId=' + taskId, null);
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/stop?taskId=' +
        taskId,
        null
      );
    }
  }

  pause(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Time/pause?taskId=' + taskId, null);
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/pause?taskId=' +
        taskId,
        null
      );
    }
  }

  workLoad(taskId: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Time/getWorkLoad?taskId=' + taskId);
    } else {
      return this.http.get<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/getWorkLoad?taskId=' +
        taskId
      );
    }
  }

  addTimeTrack(taskId: number, start, end): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Time/addTimeTrack?taskId=' + taskId + '&start=' + start + '&end=' + end, null);
    } else {
      return this.http.post<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/addTimeTrack?taskId=' + taskId + '&start=' + start + '&end=' + end, null
      );
    }
  }

  editTimeTrack(timeTrackId: number, taskId: number, start, end): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Time/updateStartAndEndTimeTrack?id=' + timeTrackId + '&taskId=' + taskId + '&start=' + start + '&end=' + end, null);
    } else {
      return this.http.put<any>(
        '/' +
        localStorage.getItem('languageCode') +
        '/Time/updateStartAndEndTimeTrack?id=' + timeTrackId + '&taskId=' + taskId + '&start=' + start + '&end=' + end, null
      );
    }
  }
}
