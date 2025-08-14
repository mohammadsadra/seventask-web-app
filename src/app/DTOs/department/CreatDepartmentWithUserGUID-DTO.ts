import {UserDTO} from '../user/UserDTO';

export class CreatDepartmentWithUserGUIDDTO {
  public name: string;
  public description: string = null;
  public color: string = null;
  public users: Array<string>;

  constructor(
    name: string,
    description: string,
    color: string,
    users: Array<string>,
  ) {
    this.name = name;
    this.description = description;
    this.color = color;
    this.users = users;
  }
}
