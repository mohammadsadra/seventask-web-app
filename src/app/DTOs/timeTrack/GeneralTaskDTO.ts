import { UserDTO } from '../user/UserDTO';
export class GeneralTaskDTO {
  public id: number;
  public title: string;
  public description: String;
  public priorityId: number;
  public priorityTitle: string;
  public createdOn: Date;
  public modifiedOn: Date;
  public createdBy: UserDTO;
  public modifiedBy: UserDTO;
  public endDate: Date;
  public startDate: Date;
  public guid: string;
  public teamId: number;
  public projectId: number;
  public projectName: string;
  public teamName: string;
  public statusId: number;
  public statusTitle: string;
  public isUrgent: boolean;

  constructor(
    id: number,
    title: string,
    description: String,
    priorityId: number,
    priorityTitle: string,
    createdOn: Date,
    modifiedOn: Date,
    createdBy: UserDTO,
    modifiedBy: UserDTO,
    endDate: Date,
    startDate: Date,
    guid: string,
    teamId: number,
    projectId: number,
    teamName: string,
    projectName: string,
    statusId: number,
    statusTitle: string,
    isUrgent: boolean
  ) {
    this.id = id;
    this.title = title;
    this.createdBy = createdBy;
    this.description = description;
    this.priorityId = priorityId;
    this.priorityTitle = priorityTitle;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.endDate = endDate;
    this.startDate = startDate;
    this.guid = guid;
    this.teamId = teamId;
    this.projectId = projectId;
    this.teamName = teamName;
    this.projectName = projectName;
    this.statusId = statusId;
    this.statusTitle = statusTitle;
    this.isUrgent = isUrgent;
  }
}
