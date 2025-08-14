import {TaskCommentDTO} from '../kanban/TaskCommentDTO';

export class HubCommentResponseModel {
  public comment: TaskCommentDTO;
  public isCreated: boolean;

  constructor(comment: TaskCommentDTO, isCreated: boolean) {
    this.comment = comment;
    this.isCreated = isCreated;
  }
}
