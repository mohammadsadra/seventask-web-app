import {BaseResponseModel} from './BaseResponseModel';
import {StatusDTO} from '../kanban/StatusDTO';

export class GetStatusResponseModel extends BaseResponseModel {
  value: StatusDTO[];

}
