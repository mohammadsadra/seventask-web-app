// tslint:Disable-next-line:class-name
export class ForwardMessageDTO {
  public messageID: string;
  public channelTypeId: number;
  public channelId: string;
  public replyTo?: string;

  constructor(
    messageID: string,
    channelTypeId: number,
    channelId: string,
    replyTo: string,
  ) {
    this.messageID = messageID;
    this.channelTypeId = channelTypeId;
    this.channelId = channelId;
    this.replyTo = replyTo;
  }
}
