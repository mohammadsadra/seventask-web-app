import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeedbackDTO} from '../../DTOs/feedback/FeedbackDTO';
import {Observable} from 'rxjs';
import {FeatureDTO} from '../../DTOs/whatIsNew/FeatureDTO';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient) { }

  getLastVersion(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<null>('/en-US/Version/getLastVersion');
    } else {
      return this.http.get<null>('/' + localStorage.getItem('languageCode') + '/Version/getLastVersion');
    }
  }
  getVersionLogs(id): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<FeatureDTO>('/en-US/Version/getVersionLogs?id=' + id);
    } else {
      return this.http.get<FeatureDTO>('/' + localStorage.getItem('languageCode') + '/Version/getVersionLogs?id=' + id);
    }
  }
}
