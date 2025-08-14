import { UserDTO } from "../user/UserDTO";

export class ReminderResponseModel {
    public reminderId: number;
    public taskId: number;
    public remindOn: Date;
    public reminderLinkedUsers: UserDTO[];
  
    constructor(reminderId: number, taskId: number, remindOn: Date, reminderLinkedUsers: UserDTO[]) {
      this.reminderId = reminderId;
      this.taskId = taskId;
      this.remindOn = remindOn;
      this.reminderLinkedUsers = reminderLinkedUsers;
    }
  }
  