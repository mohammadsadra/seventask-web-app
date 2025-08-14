export class EventModel {
  public title: string;
  public description: string;
  public isAllDay: boolean;
  public link: string;
  public startTime: Date;
  public endTime: Date;
  public teamId: number;
  public projectIds: number[];
  public users: string[];
  public attachments: string[];
  public userInvitations: string[];
  public emailInvitations: string[];

  constructor(
    title: string,
    description: string,
    isAllDay: boolean,
    link: string,
    startTime: Date,
    endTime: Date,
    teamId: number,
    projectIds: number[],
    users: string[],
    attachments: string[],
    userInvitations: string[],
    emailInvitations: string[]
  ) {
    this.title = title;
    this.description = description;
    this.isAllDay = isAllDay;
    this.link = link;
    this.startTime = startTime;
    this.endTime = endTime;
    this.teamId = teamId;
    this.projectIds = projectIds;
    this.users = users;
    this.attachments = attachments;
    this.userInvitations = userInvitations;
    this.emailInvitations = emailInvitations;
  }
}
