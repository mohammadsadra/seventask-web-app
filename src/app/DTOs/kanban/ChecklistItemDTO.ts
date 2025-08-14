export class ChecklistItemDTO {
  public id: number;
  public taskId: number;
  public title: string;
  public createdBy: string;
  public modifiedBy: string;
  public modifiedOn: Date;
  public createdOn: Date;
  public isChecked = false;


  constructor(id: number,
              taskId: number,
              title: string,
              createdBy: string,
              modifiedBy: string,
              modifiedOn: Date,
              createdOn: Date,
              isChecked: boolean) {
    this.taskId = taskId;
    this.title = title;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.modifiedOn = modifiedOn;
    this.createdOn = createdOn;
    this.isChecked = isChecked;
  }
}
