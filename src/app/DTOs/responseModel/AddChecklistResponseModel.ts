import {BaseResponseModel} from './BaseResponseModel';
import {CheckListDTO} from '../kanban/CheckListDTO';


export class AddChecklistResponseModel extends BaseResponseModel {
  value: CheckListDTO;
}
