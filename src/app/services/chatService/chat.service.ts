import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GetMessageParametersDTO} from '../../DTOs/chat/GetMessageParametersDTO';
import {pinOrUnPinOrUnMuteChannelDTO} from '../../DTOs/chat/PinOrUnPinOrUnMuteChannelDTO';
import {MuteChannelDTO} from '../../DTOs/chat/MuteChannelDTO';
import {UserDTO} from '../../DTOs/user/UserDTO';
import {messageDTO} from '../../DTOs/chat/MessageDTO';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {
  }

  getChannels(): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Channel/getAll');
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/Channel/getAll');
    }

  }

  getFiles(channelId, channelTypeId): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<messageDTO>('/en-US/Message/getFiles?channelId=' + channelId + '&channelTypeId=' + channelTypeId);
    } else {
      return this.http.get<messageDTO>('/' + localStorage.getItem('languageCode') + '/Message/getFiles?channelId=' + channelId + '&channelTypeId=' + channelTypeId);
    }

  }

  getNumberOfUnreadMessages(): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Channel/getNumberOfUnreadMessages');
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/Channel/getNumberOfUnreadMessages');
    }

  }

  getChannelMembers(channelId, channelTypeId): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<UserDTO>('/en-US/Channel/getChannelMembers?channelId=' + channelId + '&channelTypeId=' + channelTypeId);
    } else {
      return this.http.get<UserDTO>('/' + localStorage.getItem('languageCode') + '/Channel/getChannelMembers?channelId=' + channelId + '&channelTypeId=' + channelTypeId);
    }

  }

  getMessage(Message: GetMessageParametersDTO): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Message/get?channelId=' + Message.channelId + '&channelTypeId=' + Message.channelTypeId + '&pageIndex=' + Message.pageIndex + '&pageSize=' + Message.pageSize);
    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/Message/get?channelId=' + Message.channelId + '&channelTypeId=' + Message.channelTypeId + '&pageIndex=' + Message.pageIndex + '&pageSize=' + Message.pageSize);
    }

  }

  // tslint:Disable-next-line:no-shadowed-variable
  pinChannel(pinOrUnPinChannel: pinOrUnPinOrUnMuteChannelDTO): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Channel/pinChannel', pinOrUnPinChannel);

    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/Channel/pinChannel', pinOrUnPinChannel);
    }

  }

  // tslint:Disable-next-line:no-shadowed-variable
  unPinChannel(pinOrUnPinChannel: pinOrUnPinOrUnMuteChannelDTO): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.put<any>('/en-US/Channel/unpinChannel', pinOrUnPinChannel);

    } else {
      return this.http.put<any>('/' + localStorage.getItem('languageCode') + '/Channel/unpinChannel', pinOrUnPinChannel);
    }

  }

  // tslint:Disable-next-line:no-shadowed-variable
  muteChannel(muteChannelDTO: MuteChannelDTO): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Channel/muteChannel', muteChannelDTO);

    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/Channel/muteChannel', muteChannelDTO);
    }

  }

  unMuteChannel(unMuteChannelDTO: pinOrUnPinOrUnMuteChannelDTO): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.post<any>('/en-US/Channel/unmuteChannel', unMuteChannelDTO);

    } else {
      return this.http.post<any>('/' + localStorage.getItem('languageCode') + '/Channel/unmuteChannel', unMuteChannelDTO);
    }

  }

  getPinnedMessages(channelId, channelTypeId): Observable<any> {

    if (localStorage.getItem('languageCode') === null) {
      localStorage.setItem('languageCode', 'en-US');
      return this.http.get<any>('/en-US/Message/getPinnedMessages?channelId=' + channelId + '&channelTypeId=' + channelTypeId);

    } else {
      return this.http.get<any>('/' + localStorage.getItem('languageCode') + '/Message/getPinnedMessages?channelId=' + channelId + '&channelTypeId=' + channelTypeId);
    }

  }
}
