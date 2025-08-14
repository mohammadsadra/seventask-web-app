import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDTO } from '../../DTOs/notification/NotificationDTO';

@Injectable({
  providedIn: 'root',
})
export class NotificService {
  lastNotificDate: any;
  noNotifiction;
  constructor(private http: HttpClient) {}
  getLastNotificDate() {
    return this.lastNotificDate;
  }
  setLastNotificDate(value) {
    this.lastNotificDate = value;
  }
  /* notification property */
  getNoNotification() {
    return this.noNotifiction;
  }
  setNoNotification(value) {
    this.noNotifiction = value;
  }
  /* end of notification property */

  getNotification(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<NotificationDTO>('/en-US/notification/get');
    } else {
      return this.http.get<NotificationDTO>(
        '/' + localStorage.getItem('languageCode') + '/notification/get'
      );
    }
  }

  getNotReceivedNotification(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<NotificationDTO>(
        '/en-US/notification/getNotReceived'
      );
    } else {
      return this.http.get<NotificationDTO>(
        '/' +
          localStorage.getItem('languageCode') +
          '/notification/getNotReceived'
      );
    }
  }

  getReceivedNotification(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<NotificationDTO>('/en-US/notification/getReceived');
    } else {
      return this.http.get<NotificationDTO>(
        '/' + localStorage.getItem('languageCode') + '/notification/getReceived'
      );
    }
  }

  getNumberOfNonReceived(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/notification/getNumberOfNonReceived');
    } else {
      return this.http.get<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/notification/getNumberOfNonReceived'
      );
    }
  }

  UpdateMarkAsReceived(param = null): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/notification/markAsReceived', param);
    } else {
      return this.http.put<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/notification/markAsReceived',
        param
      );
    }
  }
  /* get number of all notification */
  getNumberOfAll(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Notification/getNumberOfNotifs');
    } else {
      return this.http.get<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Notification/getNumberOfNotifs'
      );
    }
  }
  /*  */
  getAllPageReceived(pageSize, PageNumber): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>(
        '/en-US/Notification/getPaged?page_size=' +
          pageSize +
          '&page_number=' +
          PageNumber
      );
    } else {
      return this.http.get<any>(
        '/' +
          localStorage.getItem('languageCode') +
          '/Notification/getPaged?page_size=' +
          pageSize +
          '&page_number=' +
          PageNumber
      );
    }
  }
}
