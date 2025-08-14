import {BaseResponseModel} from './BaseResponseModel';
import {GeneralTaskDTO} from '../kanban/GeneralTaskDTO';


export class CreateTaskResponseModel extends BaseResponseModel {
  value: GeneralTaskDTO;

}
