import {BaseResponseModel} from './BaseResponseModel';
import {UserDTO} from '../user/UserDTO';

export class UsersAssignedToTaskResponseModel extends BaseResponseModel {
  value: {
    UsersAssignedTo: UserDTO[]
  };

}
