import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EventModel} from '../../../DTOs/calendar/EventModel';
import {BaseResponseModel} from '../../../DTOs/responseModel/BaseResponseModel';
import {MainResponseModel} from '../../../DTOs/responseModel/MainResponseModel';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { AddAttachmentDTO } from 'src/app/DTOs/kanban/AddAttachmentDTO';
import {CalendarEventsResponseModel} from '../../../DTOs/calendar/CalendarEventsResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CalendarApiService {

  constructor(private http: HttpClient) {
  }

  createEvent(eventModel: EventModel): Observable<MainResponseModel<EventResponseModel>> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<MainResponseModel<EventResponseModel>>('/en-US/calendar/createEvent', eventModel);
    } else {
      return this.http.post<MainResponseModel<EventResponseModel>>('/' + localStorage.getItem('languageCode') +
        '/calendar/createEvent', eventModel);
    }
  }

  getEventsInPeriod(from, to): Observable<MainResponseModel<CalendarEventsResponseModel>> {
    return this.http.get<MainResponseModel<CalendarEventsResponseModel>>(`/en-US/Calendar/tempGetEventsInPeriod?from=${from}&to=${to}`);
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<MainResponseModel<CalendarEventsResponseModel>>(`/en-US/Calendar/tempGetEventsInPeriod?from=${from}&to=${to}`);
    } else {
      return this.http.get<MainResponseModel<CalendarEventsResponseModel>>(`/${localStorage.getItem('languageCode')}/Calendar/tempGetEventsInPeriod?from=${from}&to=${to}`);
    }
  }

  getNumberOfTasksAndEvents(from, to): Observable<MainResponseModel<number>> {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<MainResponseModel<number>>(`/en-US/Calendar/getNumberOfTaksAndEvent?from=${from}&to=${to}`);
    } else {
      return this.http.get<MainResponseModel<number>>(`/${localStorage.getItem('languageCode')}/Calendar/getNumberOfTaksAndEvent?from=${from}&to=${to}`);
    }
  }

  deleteEvent(id: number) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete('/en-US/calendar/deleteEvent?id=' + id);
    } else {
      return this.http.delete('/' + localStorage.getItem('languageCode') +
        '/calendar/deleteEvent?id=' + id);
    }
  }

  editEventTitle(id: number, title: string) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateTitle?id=${id}`, {'value': title});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/calendar/updateTitle?id=${id}`, {'value': title});
    }
  }

  editEventDescription(id: number, description: string) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateDescription?id=${id}`, {'value': description});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/calendar/updateDescription?id=${id}`, {'value': description});
    }
  }

  editAllDay(id: number, allDay: boolean) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateIsAllDay?id=${id}&newIsAllDay=${allDay}`, {});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/calendar/updateIsAllDay?id=${id}&newIsAllDay=${allDay}`, {});
    }
  }

  editEventStartTime(id: number, startTime) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateStartTime?id=${id}&newStartTime=${startTime}`, {});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
      `/calendar/updateStartTime?id=${id}&newStartTime=${startTime}`, {});
    }
  }

  editEventEndTime(id: number, endTime) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateEndTime?id=${id}&newEndTime=${endTime}` , {});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
      `/calendar/updateEndTime?id=${id}&newEndTime=${endTime}`, {});
    }
  }

  editEventLink(id: number, link: string) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put(`/en-US/calendar/updateLink?id=${id}`, {'value': link});
    } else {
      return this.http.put('/' + localStorage.getItem('languageCode') +
        `/calendar/updateLink?id=${id}`, {'value': link});
    }
  }

  deleteEventAttachment(eventId: number, attachmentGuid: string) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.delete(`/en-US/calendar/deleteAttachment?id=${eventId}&attachmentGuid=${attachmentGuid}`);
    } else {
      return this.http.delete('/' + localStorage.getItem('languageCode') +
      `/calendar/deleteAttachment?id=${eventId}&attachmentGuid=${attachmentGuid}`, {});
    }
  }

  addEventAttachment(addAttachmentDTO: AddAttachmentDTO) {
    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/calendar/addAttachment', addAttachmentDTO);
    } else {
      return this.http.post<any>(
        '/' + localStorage.getItem('languageCode') + '/calendar/addAttachment',
        addAttachmentDTO
      );
    }
  }

}
