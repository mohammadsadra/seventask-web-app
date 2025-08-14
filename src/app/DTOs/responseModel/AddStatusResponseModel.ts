import {BaseResponseModel} from './BaseResponseModel';
import {StatusDTO} from '../kanban/StatusDTO';


export class AddStatusResponseModel extends BaseResponseModel {
  value: StatusDTO;
}
