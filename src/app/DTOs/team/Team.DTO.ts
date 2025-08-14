import {DepartmentDTO} from '../department/DepartmentDTO';
import {UserDTO} from '../user/UserDTO';

export class TeamDTO {
  public id: number;
  public teamTypeId: number;
  public name: string;
  public description: string;
  public color: string;
  public createdBy: UserDTO;
  public modifiedBy: UserDTO;
  public createdOn: Date;
  public modifiedOn: Date;
  public guid: string;
  public teamImageGuid: string;
  public numberOfTasks: number;
  public numberOfDepartments: number;
  public numberOfMembers: number;
  public numberOfProjects: number;
  public departments: Array<DepartmentDTO>;


  constructor(
    id: number,
    teamTypeId: number,
    name: string,
    description: string,
    color: string,
    createdBy: UserDTO,
    modifiedBy: UserDTO,
    createdOn: Date,
    guid: string,
    teamImageGuid: string,
    numberOfTasks: number,
    numberOfDepartments: number,
    numberOfMembers: number,
    numberOfProjects: number,
    departments: Array<DepartmentDTO>
  ) {
    this.id = id;
    this.teamTypeId = teamTypeId;
    this.name = name;
    this.description = description;
    this.color = color;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.createdOn = createdOn;
    this.guid = guid;
    this.teamImageGuid = teamImageGuid;
    this.numberOfTasks = numberOfTasks;
    this.numberOfDepartments = numberOfDepartments;
    this.numberOfMembers = numberOfMembers;
    this.numberOfProjects = numberOfProjects;
    this.departments = departments;
  }
}
