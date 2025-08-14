export class AddUserToTeamDTO {
  public users: Array<string>;
  public emailsForInvite: Array<string>;
  public teamId: number;

  constructor(
    users: Array<string>,
    emailsForInvite: Array<string>,
    teamId: number
  ) {
    this.users = users;
    this.emailsForInvite = emailsForInvite;
    this.teamId = teamId;
  }
}
