export class EditprojectDTO {
  public id: number;
  public name: string;
  public description: string = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public color: string = null;
  public teamId: number = null;
  public departmentId: number = null;

  constructor(
    id: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    color: string,
    teamId: number,
    departmentId: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.color = color;
    this.startDate = startDate;
    this.endDate = endDate;
    this.teamId = teamId;
    this.departmentId = departmentId;
  }
}
