export class TeamHistoryDTO {
  public message: string;
  public time: Date;

  constructor(
    message: string,
    time: Date
  ) {
    this.message = message;
    this.time = time;
  }
}
