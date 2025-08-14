import {UserDTO} from '../user/UserDTO';

export class TaskCommentDTO {
  public id: number;
  public generalTaskId: number;
  public body: string;
  public commentedOn: Date;
  public modifiedOn: Date;
  public commentedBy: UserDTO;
  public attachments?: string[];

  constructor(id: number, generalTaskId: number, body: string, commentedOn: Date, modifiedOn: Date,
              commentedBy: UserDTO, attachments: string[]) {
    this.id = id;
    this.generalTaskId = generalTaskId;
    this.body = body;
    this.commentedOn = commentedOn;
    this.modifiedOn = modifiedOn;
    this.commentedBy = commentedBy;
    this.attachments = attachments;
  }

}
