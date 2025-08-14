export class LastMessageInChannelDTO {
  public fromNickName: string;
  public fromUserId: string;
  public body: string;
  public sendOn: string;
  public messageTypeId: number;

  constructor(
    fromNickName: string,
    fromUserId: string,
    body: string,
    sendOn: string,
    messageTypeId: number
  ) {
    this.fromNickName = fromNickName;
    this.fromUserId = fromUserId;
    this.body = body;
    this.sendOn = sendOn;
    this.messageTypeId = messageTypeId;
  }
}
