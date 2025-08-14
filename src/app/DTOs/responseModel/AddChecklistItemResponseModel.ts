import {BaseResponseModel} from './BaseResponseModel';
import {CheckListDTO} from '../kanban/CheckListDTO';
import {ChecklistItemDTO} from '../kanban/ChecklistItemDTO';


export class AddChecklistItemResponseModel extends BaseResponseModel {
  value: ChecklistItemDTO;
}
