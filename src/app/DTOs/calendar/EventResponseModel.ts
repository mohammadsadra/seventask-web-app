import {FileDTO} from '../file/FileDTO';

export class EventResponseModel {
  public id: number;
  public googleCalendarEventId: string;
  public title: string;
  public description: string;
  public isAllDay: boolean;
  public link: string;
  public startTime: Date;
  public endTime: Date;
  public teamId: number;
  public projectIds: number[];
  public users: string[];
  public attachments: FileDTO[];
  public userInvitations: string[];
  public emailInvitations: string[];
  color: string;

  constructor(
    id: number,
    googleCalendarEventId: string,
    title: string,
    description: string,
    isAllDay: boolean,
    link: string,
    startTime: Date,
    endTime: Date,
    teamId: number,
    projectIds: number[],
    users: string[],
    attachments: FileDTO[],
    userInvitations: string[],
    emailInvitations: string[]
  ) {
  }
}
