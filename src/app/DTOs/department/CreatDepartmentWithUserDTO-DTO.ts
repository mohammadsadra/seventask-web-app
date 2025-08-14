import {UserDTO} from '../user/UserDTO';

export class CreatDepartmentWithUserDTODTO {
  public name: string;
  public description: string = null;
  public color: string = null;
  public users: Array<UserDTO>;

  constructor(
    name: string,
    description: string,
    color: string,
    users: Array<UserDTO>,
  ) {
    this.name = name;
    this.description = description;
    this.color = color;
    this.users = users;
  }
}
