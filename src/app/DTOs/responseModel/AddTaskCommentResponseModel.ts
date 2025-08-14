import {BaseResponseModel} from './BaseResponseModel';
import {TaskCommentDTO} from '../kanban/TaskCommentDTO';

export class AddTaskCommentResponseModel extends BaseResponseModel {
  value: TaskCommentDTO;

}
