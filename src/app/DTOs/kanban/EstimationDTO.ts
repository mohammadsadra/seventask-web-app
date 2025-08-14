import {UserDTO} from '../user/UserDTO';

export class EstimationDTO {
  public estimationTimeInMinute: number;
  public user: UserDTO;

  constructor(estimationTimeInMinute: number, user: UserDTO) {
    this.estimationTimeInMinute = estimationTimeInMinute;
    this.user = user;
  }
}
