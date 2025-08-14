import {UserDTO} from '../user/UserDTO';

export class DepartmentDTO {
  public id: number;
  public teamId: number;
  public name: string;
  public color: string;
  public description: string;
  public guid: string;
  public createdBy: UserDTO;
  public modifiedBy: UserDTO;
  public createdOn: Date;
  public modifiedOn: Date;
  public departmentImageGuid: string;
  public users: Array<UserDTO>;


  constructor(
    id: number,
    teamId: number,
    name: string,
    color: string,
    description: string,
    guid: string,
    createdBy: UserDTO,
    modifiedBy: UserDTO,
    createdOn: Date,
    modifiedOn: Date,
    departmentImageGuid: string,
    users: Array<UserDTO>
  ) {
    this.id = id;
    this.teamId = teamId;
    this.name = name;
    this.color = color;
    this.description = description;
    this.guid = guid;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
    this.departmentImageGuid = departmentImageGuid;
    this.users = users;
  }
}
