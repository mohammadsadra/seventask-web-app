export class UserClicksDTO {
  public dashboard: number;
  public todo: number;
  public project: number;
  public team: number;
  public calendar: number;
  public chat: number;
  public more: number;


  constructor(
    dashboard: number,
    todo: number,
    project: number,
    team: number,
    calendar: number,
    chat: number,
    more: number,
  ) {
    this.dashboard = dashboard;
    this.todo = todo;
    this.project = project;
    this.team = team;
    this.calendar = calendar;
    this.chat = chat;
    this.more = more;
  }
}
