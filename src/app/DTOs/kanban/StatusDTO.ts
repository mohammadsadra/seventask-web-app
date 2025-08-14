export class StatusDTO {
  public id: number;
  public teamId: number;
  public projectId: number;
  public userProfileId: number;
  public evenOrder: number;
  public title: string;

  constructor(id: number, title: string, evenOrder: number, teamId?: number, projectId?: number, userProfileId?: number) {
    this.id = id;
    this.title = title;
    this.teamId = teamId;
    this.projectId = projectId;
    this.userProfileId = userProfileId;
    this.evenOrder = evenOrder;
  }

}
