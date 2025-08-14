// tslint:Disable-next-line:class-name
export class pinOrUnPinOrUnMuteChannelDTO {
  public channelId: string;
  public channelTypeId: string;

  constructor(
    channelId: string,
    channelTypeId: string,
  ) {
    this.channelId = channelId;
    this.channelTypeId = channelTypeId;

  }
}
