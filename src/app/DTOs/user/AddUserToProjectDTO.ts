export class AddUserToProjectDTO {
  public users: Array<string>;
  public projectId: number;

  constructor(
    users: Array<string>,
    projectId: number
  ) {
    this.users = users;
    this.projectId = projectId;
  }
}
