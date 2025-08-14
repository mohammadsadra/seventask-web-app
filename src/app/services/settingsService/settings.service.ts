import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SettingsDTO} from '../../DTOs/settings/SettingsDTO';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private zoomSource = new BehaviorSubject<number>(0.85);
  currentZoom = this.zoomSource.asObservable();

  public static getSettingsFromLocalStorage() {
    if (localStorage.getItem('settingsData') !== null) {
      const settingsDTO: SettingsDTO = JSON.parse(localStorage.getItem('settingsData'));
      return settingsDTO;
    }
    return null;
  }

  public static updateSettingsInLocalStorage(settings: SettingsDTO) {
    localStorage.setItem('settingsData', JSON.stringify(settings));
  }

  changeZoom(zoom: number) {
    this.zoomSource.next(zoom);
  }

  constructor(private http: HttpClient) { }

  toggleDarkMode(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/toggleDarkMode', {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/toggleDarkMode', {}
      );
    }
  }

  getSettings(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Setting/getSettings');
    } else {
      return this.http.get<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/getSettings'
      );
    }
  }

  toggleSecondCalendar(): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/toggleSecondCalendar', {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/toggleSecondCalendar', {}
      );
    }
  }

  setFirstWeekDay(day: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/setFirstWeekDay?day=' + day, {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/setFirstWeekDay?day=' + day, {}
      );
    }
  }

  setFirstCalendar(calendar: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/setFirstCalander?calendar=' + calendar, {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/setFirstCalander?calendar=' + calendar, {}
      );
    }
  }

  setSecondCalendar(calendar: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/setSecondCalander?calendar=' + calendar, {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/setSecondCalander?calendar=' + calendar, {}
      );
    }
  }

  updateWeekends(weekends: number[]): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/updateWeekends', weekends);
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/updateWeekends', weekends
      );
    }
  }

  setThemeColor(color: string): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/setThemeColor', {value: color});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/setThemeColor', {value: color}
      );
    }
  }

  setZoomRatio(zoom: number): Observable<any> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Setting/setZoomRatio?zoomRatio=' + zoom, {});
    } else {
      return this.http.put<any>(
        '/' + localStorage.getItem('languageCode') + '/Setting/setZoomRatio?zoomRatio=' + zoom, {}
      );
    }
  }
}
