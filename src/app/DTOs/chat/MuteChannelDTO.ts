// tslint:Disable-next-line:class-name
export class MuteChannelDTO {
  public channelTypeId: string;
  public channelId: string;
  public forEver: boolean;
  public muteMinutes: number;

  constructor(
    channelTypeId: string,
    channelId: string,
    forEver: boolean,
    muteMinutes: number
  ) {
    this.channelTypeId = channelTypeId;
    this.channelId = channelId;
    this.forEver = forEver;
    this.muteMinutes = muteMinutes;

  }
}
