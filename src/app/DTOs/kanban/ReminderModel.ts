export class ReminderModel {
    public taskId: number;
    public remindOn: Date;
    public reminderLinkedUserIds: string[];
  
    constructor(taskId: number, remindOn: Date, reminderLinkedUserIds: string[]) {
      this.taskId = taskId;
      this.remindOn = remindOn;
      this.reminderLinkedUserIds = reminderLinkedUserIds;
    }
  }