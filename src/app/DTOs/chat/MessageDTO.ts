// tslint:Disable-next-line:class-name
export class messageDTO {
  public messageID: string;
  public isSentFromMe: boolean;
  public sentOn: Date;
  public body: string;
  public messageTypeId: number;
  public channelTypeId: number;
  public channelId: string;
  public fromNickName: string;
  public fromUserId: string;
  public fromUserImageId: string;
  public replyTo?: string;
  public isPinned: boolean;
  public isEdited: boolean;
  public isForwarded: boolean;
  public forwardedFrom: string;

  constructor(
    messageID: string,
    body: string,
    messageTypeId: number,
    isSentFromMe: boolean,
    channelTypeId: number,
    channelId: string,
    sentOn: Date,
    fromNickName: string,
    fromUserId: string,
    fromUserImageId: string,
    replyTo: string,
    isEdited: boolean,
    isPinned: boolean,
    isForwarded: boolean,
    forwardedFrom: string,
  ) {
    this.messageID = messageID;
    this.body = body;
    this.messageTypeId = messageTypeId;
    this.isSentFromMe = isSentFromMe;
    this.channelTypeId = channelTypeId;
    this.channelId = channelId;
    this.sentOn = sentOn;
    this.fromNickName = fromNickName;
    this.fromUserId = fromUserId;
    this.fromUserImageId = fromUserImageId;
    this.replyTo = replyTo;
    this.isEdited = isEdited;
    this.isPinned = isPinned;
    this.isForwarded = isForwarded;
    this.forwardedFrom = forwardedFrom;
  }
}
