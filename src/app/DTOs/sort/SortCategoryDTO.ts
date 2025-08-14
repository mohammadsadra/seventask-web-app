export class SortCategoryDTO {
  public id: number;
  public name: string;

  // public priorityIds: number[]; // priorityIds

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
