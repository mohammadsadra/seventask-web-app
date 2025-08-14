export class EditTeamDTO {
  public id: number;
  public name: string;
  public description: string;
  public color: string;

  constructor(
    id: number,
    name: string,
    description: string,
    color: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.color = color;
  }
}
