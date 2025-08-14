import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // private currentLanguage = 'en-US';

  constructor(private http: HttpClient) {
  }

  changeLanguage(code): Observable<any> {
    if (code === 'en-US') {
      // console.log('1');
      return this.http.post<any>('/en-US/account/setCulture?cultureId=1', '');
    } else if (code === 'fr-FR') {
      // console.log('2');
     return this.http.post<any>('/fr-FR/account/setCulture?cultureId=2', '');
    } else if (code === 'ru-RU') {
      // console.log('3');
      return this.http.post<any>('/ru-RU/account/setCulture?cultureId=3', '');
    } else if (code === 'es-SP') {
      // console.log('4');
      return this.http.post<any>('/es-SP/account/setCulture?cultureId=4', '');
    } else if (code === 'pt-PG') {
      // console.log('5');
      return this.http.post<any>('/pt-PG/account/setCulture?cultureId=5', '');
    } else if (code === 'fa-IR') {
      // console.log('6');
      return this.http.post<any>('/fa-IR/account/setCulture?cultureId=6', '');
    } else if (code === 'ar-SB') {
      // console.log('7');
      return this.http.post<any>('/ar-SB/account/setCulture?cultureId=7', '');
    } else if (code === 'de-GE') {
      // console.log('8');
      return this.http.post<any>('/de-GE/account/setCulture?cultureId=8', '');
    } else if (code === 'it-IT') {
      // console.log('9');
      return this.http.post<any>('/it-IT/account/setCulture?cultureId=9', '');
    } else if (code === 'tr-TU') {
      // console.log('10');
      return this.http.post<any>('/tr-TU/account/setCulture?cultureId=10', '');
    }
    // console.log('request started');
  }

  getLanguage(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      return this.http.get<any>('/en-US/account/getCulture');
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/account/getCulture');
    }
  }
}
