import {BaseResponseModel} from './BaseResponseModel';
import {ActivityLogDTO} from '../kanban/ActivityLogDTO';

export class GetTaskHistoryResponseModel extends BaseResponseModel {
  value: ActivityLogDTO[];
}
