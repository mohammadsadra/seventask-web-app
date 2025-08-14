export class TaskCommentPostDTO {
  public id: number;
  public body: string;
  public attachments: string[];

  constructor(id: number, body: string, attachments: string[]) {
    this.id = id;
    this.body = body;
    this.attachments = attachments;
  }

}
