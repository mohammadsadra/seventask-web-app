export class CreatProjectDTO {
  public name: string;
  public description: string = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public color: string = null;
  public teamId: number = null;
  public DepartmentIds: Array<number> = null;
  public users: Array<number> = null;

  constructor(
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    color: string,
    teamId: number,
    DepartmentIds: Array<number>,
    users: Array<number>
  ) {
    this.name = name;
    this.description = description;
    this.color = color;
    this.startDate = startDate;
    this.endDate = endDate;
    this.teamId = teamId;
    this.DepartmentIds = DepartmentIds;
    this.users = users;
  }
}
