import {BaseResponseModel} from './BaseResponseModel';
import {StatusDTO} from '../kanban/StatusDTO';

export class GetRunningTasksResponseModel {

  taskId: number;
  isPaused: boolean;
  startDate: string;

  constructor(taskId: number, isPaused: boolean, startDate: string = Date()) {
    this.taskId = taskId;
    this.isPaused = isPaused;
    this.startDate = startDate;
  }


}
