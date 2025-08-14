export class AddTagDTO {
  public title: string;
  public taskId: number;


  constructor(taskId?: number, title?: string) {
    this.taskId = taskId;
    this.title = title;
  }

}
