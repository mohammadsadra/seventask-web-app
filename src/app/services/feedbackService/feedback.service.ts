import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeedbackDTO} from '../../DTOs/feedback/FeedbackDTO';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  creatFeedback(feedback: FeedbackDTO): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<FeedbackDTO>('/en-US/feedback/sendFeedback', feedback);
    } else {
      return this.http.post<FeedbackDTO>('/' + localStorage.getItem('languageCode') + '/feedback/sendFeedback', feedback);
    }
  }
}
