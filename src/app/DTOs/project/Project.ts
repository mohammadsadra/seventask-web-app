import {UserDTO} from '../user/UserDTO';

export class ProjectDTO {
  public id: number;
  public guid: string;
  public name: string;
  public description: string;
  public statusId: number;
  public numberOfUpdates: number;
  public startDate: Date;
  public endDate: Date;
  public createdBy: UserDTO;
  public modifiedBy: UserDTO;
  public createdOn: Date;
  public modifiedOn: Date;
  public color: string;
  public teamId: number;
  public teamName: string;
  public users: Array<UserDTO>;
  public departmentId: Array<number>;
  public projectImageId: number;
  public numberOfTasks: number;
  public spentTimeInMinutes: number;

  constructor(
    id: number,
    guid: string,
    name: string,
    description: string,
    statusId: number,
    numberOfUpdates: number,
    startDate: Date,
    endDate: Date,
    createdBy: UserDTO,
    modifiedBy: UserDTO,
    createdOn: Date,
    modifiedOn: Date,
    color: string,
    teamId: number,
    teamName: string,
    users: Array<UserDTO>,
    departmentId: Array<number>,
    projectImageId: number,
    numberOfTasks: number,
    spentTimeInMinutes: number
  ) {
    this.id = id;
    this.guid = guid;
    this.name = name;
    this.description = description;
    this.statusId = statusId;
    this.numberOfUpdates = numberOfUpdates;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
    this.color = color;
    this.teamId = teamId;
    this.teamName = teamName;
    this.users = users;
    this.departmentId = departmentId;
    this.projectImageId = projectImageId;
    this.numberOfTasks = numberOfTasks;
    this.spentTimeInMinutes = spentTimeInMinutes;
  }
}
