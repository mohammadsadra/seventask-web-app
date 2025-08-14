export class ChecklistItemPostDTO {
  public title: string;
  public isChecked = false;


  constructor(title: string, isChecked: boolean) {
    this.title = title;
    this.isChecked = isChecked;
  }
}
