// tslint:Disable-next-line:class-name
import {LastMessageInChannelDTO} from './LastMessageInChannelDTO';

export class channelDTO {
  public guid: string;
  public title: string;
  public profileImageGuid: string;
  public channelTypeId: number;
  public isMuted: boolean;
  public isPinned: boolean;
  public isOnline: boolean;
  public evenOrder: number;
  public lastTransactionDateTime: string;
  public numberOfUnreadMessages: number;
  public lastMessage: LastMessageInChannelDTO;

  constructor(
    guid: string,
    title: string,
    profileImageGuid: string,
    channelTypeId: number,
    isMuted: boolean,
    isPinned: boolean,
    isOnline: boolean,
    evenOrder: number,
    lastTransactionDateTime: string,
    numberOfUnreadMessages: number,
    lastMessage: LastMessageInChannelDTO
  ) {
    this.guid = guid;
    this.title = title;
    this.profileImageGuid = profileImageGuid;
    this.channelTypeId = channelTypeId;
    this.isMuted = isMuted;
    this.isPinned = isPinned;
    this.isOnline = isOnline;
    this.evenOrder = evenOrder;
    this.lastTransactionDateTime = lastTransactionDateTime;
    this.numberOfUnreadMessages = numberOfUnreadMessages;
    this.lastMessage = lastMessage;
  }
}
