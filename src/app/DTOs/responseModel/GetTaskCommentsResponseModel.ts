import {BaseResponseModel} from './BaseResponseModel';
import {TaskCommentDTO} from '../kanban/TaskCommentDTO';

export class GetTaskCommentsResponseModel extends BaseResponseModel {
  value: TaskCommentDTO[];

}
