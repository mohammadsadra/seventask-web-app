import {UserDTO} from '../user/UserDTO';

export class AssignTaskDTO {
  public taskId: number;
  public users: string[];

  constructor(taskId: number, users: string[]) {
    this.taskId = taskId;
    this.users = users;
  }
}
