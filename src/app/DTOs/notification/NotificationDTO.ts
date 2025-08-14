export class NotificationDTO {
  public id: number;
  public isSeen: boolean;
  public message: string;
  public notificationTime: Date;
  public notificationType: number;
  public notifiedOnId: number;
  public notifiedOnName: string;
  public parameterTypes: Array<any>;
  public parameters: Array<any>;

  constructor(
    id: number,
    isSeen: boolean,
    message: string,
    notificationTime: Date,
    notificationType: number,
    notifiedOnId: number,
    notifiedOnName: string,
    parameterTypes: Array<any>,
    parameters: Array<any>
  ) {
    this.id = id;
    this.isSeen = isSeen;
    this.message = message;
    this.notificationTime = notificationTime;
    this.notificationType = notificationType;
    this.notifiedOnId = notifiedOnId;
    this.notifiedOnName = notifiedOnName;
    this.parameterTypes = parameterTypes;
    this.parameters = parameters;
  }
}
