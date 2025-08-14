import { GeneralTaskDTO } from './GeneralTaskDTO';
export class TimeTrackDTO {
  public id: number;
  public endDate: Date;
  public startDate: Date;
  public totalTimeInMinutes: number;
  public generalTask: GeneralTaskDTO;

  constructor(
    id: number,
    endDate: Date,
    startDate: Date,
    totalTimeInMinutes: number,
    generalTask: GeneralTaskDTO
  ) {
    this.id = id;
    this.endDate = endDate;
    this.startDate = startDate;
    this.totalTimeInMinutes = totalTimeInMinutes;
    this.generalTask = generalTask;
  }
}
