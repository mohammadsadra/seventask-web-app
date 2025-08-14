import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import {channelDTO} from '../../../DTOs/chat/ChannelDTO';
import {GoogleCalendarModel} from '../../../DTOs/calendar/GoogleCalendarModel';

@Injectable({
  providedIn: 'root'
})
export class CalendarDataService {
  private goTodayBehaviorSubject = new Subject();
  goTodayObservable = this.goTodayBehaviorSubject.asObservable();

  private headerDateLabelBehaviorSubject = new BehaviorSubject(null);
  headerDateLabelObservable = this.headerDateLabelBehaviorSubject.asObservable();

  private headerAlternativeDateLabelBehaviorSubject = new BehaviorSubject(null);
  headerAlternativeDateLabelObservable = this.headerAlternativeDateLabelBehaviorSubject.asObservable();

  private newEventBehaviorSubject = new BehaviorSubject(null);
  newEventObservable = this.newEventBehaviorSubject.asObservable();

  private changeViewBehaviorSubject = new BehaviorSubject(null);
  changeViewObservable = this.changeViewBehaviorSubject.asObservable();

  private numberOfEventsBehaviorSubject = new BehaviorSubject(null);
  getNumberOfEventsObservable = this.numberOfEventsBehaviorSubject.asObservable();

  private selectEventBehaviorSubject = new BehaviorSubject(null);
  getSelectedEvent = this.selectEventBehaviorSubject.asObservable();

  private deleteEventBehaviorSubject = new BehaviorSubject(null);
  getDeletedEventId = this.deleteEventBehaviorSubject.asObservable();

  private updateEventBehaviorSubject = new BehaviorSubject(null);
  getUpdatedEvent = this.updateEventBehaviorSubject.asObservable();

  private getGoogleCalendarsListBehaviorSubject = new Subject<GoogleCalendarModel[]>();
  getGoogleCalendarsList = this.getGoogleCalendarsListBehaviorSubject.asObservable();

  private showOrHideGoogleCalendarBehaviorSubject = new BehaviorSubject<{show: boolean, id: string}>(null);
  showOrHideGoogleObservable = this.showOrHideGoogleCalendarBehaviorSubject.asObservable();

  goToday() {
    this.goTodayBehaviorSubject.next(true);
  }

  changeHeaderDateLabel(newDateStr) {
    this.headerDateLabelBehaviorSubject.next(newDateStr);
  }

  changeHeaderAlternativeDateLabel(newDateStr) {
    this.headerAlternativeDateLabelBehaviorSubject.next(newDateStr);
  }

  createdNewEvent(newEvent) {
    this.newEventBehaviorSubject.next(newEvent);
  }

  changeView(view) {
    this.changeViewBehaviorSubject.next(view);
  }

  sendNumberOfTasksAndEvents(numberOfTaskAndEvents: any) {
    this.numberOfEventsBehaviorSubject.next(numberOfTaskAndEvents);
  }

  selectEvent(event: EventResponseModel) {
    this.selectEventBehaviorSubject.next(event);
  }

  deleteEvent(id: number) {
    this.deleteEventBehaviorSubject.next(id);
  }

  updateEvent(event: EventResponseModel) {
    this.updateEventBehaviorSubject.next(event);
  }

  updateGoogleCalendars(calendars: GoogleCalendarModel[]) {
    this.getGoogleCalendarsListBehaviorSubject.next(calendars);
  }

  updateGoogleCalendarShowingStatus(show: boolean, id: string) {
    this.showOrHideGoogleCalendarBehaviorSubject.next({show: show, id: id});
  }
}
