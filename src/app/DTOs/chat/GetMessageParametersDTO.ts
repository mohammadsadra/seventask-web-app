export class GetMessageParametersDTO {
  public channelId: string;
  public channelTypeId: number;
  public pageIndex: string;
  public pageSize: string;

  constructor(
    channelId: string,
    channelTypeId: number,
    pageIndex: string,
    pageSize: string
  ) {
    this.channelId = channelId;
    this.channelTypeId = channelTypeId;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}
