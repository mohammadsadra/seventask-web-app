
export class HubEditTaskResponseModel {
  public id: number;
  public name: string;
  public field: any;

  constructor(id: number, name: string, field: string) {
    this.id = id;
    this.name = name;
    this.field = field;
  }
}
