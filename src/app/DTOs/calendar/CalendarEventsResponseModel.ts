import {EventResponseModel} from './EventResponseModel';
import {GoogleCalendarEventsModel} from './GoogleCalendarEventsModel';

export class CalendarEventsResponseModel {
  sevenTaskEvents: EventResponseModel[];
  googleCalendarsEvents: GoogleCalendarEventsModel[];
}
