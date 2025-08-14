export class CreateTeamDTO {
  public name: string;
  public description: string;
  public color: string;
  public users: Array<string>;
  public departments: Array<any>;
  public emailsForInvite: Array<any>;

  constructor(
    name: string,
    description: string,
    color: string,
    users: Array<string>,
    departments: Array<any>,
    emailsForInvite: Array<any>,
  ) {
    this.name = name;
    this.description = description;
    this.color = color;
    this.users = users;
    this.departments = departments;
    this.emailsForInvite = emailsForInvite;
  }
}
