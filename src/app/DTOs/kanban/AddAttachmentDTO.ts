export class AddAttachmentDTO {
  public id: number;
  public attachments: string[];

  constructor(id: number, attachments: string[]) {
    this.id = id;
    this.attachments = attachments;
  }
}
