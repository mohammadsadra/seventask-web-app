import {BaseResponseModel} from './BaseResponseModel';
import {UserDTO} from '../user/UserDTO';

export class GetUsersCanBeAssignedResponseModel extends BaseResponseModel {
  value: UserDTO[];

}
