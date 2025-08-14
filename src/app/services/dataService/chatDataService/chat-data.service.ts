import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {channelDTO} from '../../../DTOs/chat/ChannelDTO';
import {messageDTO} from '../../../DTOs/chat/MessageDTO';

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {

  private activeChannelSource = new BehaviorSubject<channelDTO>(null);
  currentActiveChannel = this.activeChannelSource.asObservable();

  private sendMessageSource = new BehaviorSubject<any>(null);
  currentSendMessage = this.sendMessageSource.asObservable();

  private forwardMessageSource = new BehaviorSubject<any>(null);
  currentForwardMessage = this.forwardMessageSource.asObservable();

  private receiveMessageSource = new BehaviorSubject<messageDTO>(null);
  currentReceiveMessage = this.receiveMessageSource.asObservable();

  private sortChannelSource = new BehaviorSubject<any>(null);
  currentSortChannel = this.sortChannelSource.asObservable();

  private deleteMessageSource = new BehaviorSubject<any>(null);
  currentDeletedMessage = this.deleteMessageSource.asObservable();

  private editMessageSource = new BehaviorSubject<any>(null);
  currentEditedMessage = this.editMessageSource.asObservable();

  private editReceivedMessageSource = new BehaviorSubject<any>(null);
  currentReceivedEditedMessage = this.editReceivedMessageSource.asObservable();

  private editchangeRecieveOnlineSource = new BehaviorSubject<any>(null);
  currentchangeRecieveOnlineMessage = this.editchangeRecieveOnlineSource.asObservable();

  private seenMessageSource = new BehaviorSubject<any>(null);
  currentSeenMessage = this.seenMessageSource.asObservable();

  private unSeenMessageSource = new BehaviorSubject<messageDTO>(null);
  currentUnSeenMessageMessage = this.unSeenMessageSource.asObservable();

  private pinMessageSource = new BehaviorSubject<messageDTO>(null);
  currentPinMessage = this.pinMessageSource.asObservable();

  private unpinMessageSource = new BehaviorSubject<messageDTO>(null);
  currentUnPinMessage = this.unpinMessageSource.asObservable();

  constructor() {
  }

  changeActiveChannel(channel: channelDTO) {
    this.activeChannelSource.next(channel);
  }

  changeCurrentSendMessage(message) {
    this.sendMessageSource.next(message);
  }
  changeCurrentForwardMessage(message) {
    this.forwardMessageSource.next(message);
  }

  changeCurrentReceiveMessage(message) {
    this.receiveMessageSource.next(message);
  }

  changeSortChannel(channelId) {
    this.sortChannelSource.next(channelId);
  }

  changeDeletedMessage(messageID) {
    this.deleteMessageSource.next(messageID);
  }

  changeEditedMessage(editedMessage) {
    this.editMessageSource.next(editedMessage);
  }

  changeReceivedEditedMessage(editedMessage) {
    this.editReceivedMessageSource.next(editedMessage);
  }

  changeRecieveOnline(userId) {
    this.editchangeRecieveOnlineSource.next(userId);
  }

  changeSeenMessage(messageID) {
    this.seenMessageSource.next(messageID);
  }

  changeUnSeenMessage(message) {
    this.unSeenMessageSource.next(message);
  }

  changePinMessage(message) {
    this.pinMessageSource.next(message);
  }

  changeUnPinMessage(message) {
    this.unpinMessageSource.next(message);
  }
}
