import { Component, HostListener, OnInit } from '@angular/core';
import { channelDTO } from '../../../../DTOs/chat/ChannelDTO';
import { ChatService } from '../../../../services/chatService/chat.service';
import { ChatDataService } from '../../../../services/dataService/chatDataService/chat-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { DomainName } from '../../../../utilities/PathTools';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';
import { LastMessageInChannelDTO } from '../../../../DTOs/chat/LastMessageInChannelDTO';
import { DatePipe } from '@angular/common';
import { ResizedEvent } from 'angular-resize-event';
@Component({
  selector: 'app-chat-left-nav-bar',
  templateUrl: './chat-left-nav-bar.component.html',
  styleUrls: ['./chat-left-nav-bar.component.scss'],
})
export class ChatLeftNavBarComponent implements OnInit {
  showGetChannelsLoading = true;

  activeChannelGuid = '0';
  activeTab = 'All';
  activeChannel: channelDTO = null;
  height = window.innerHeight - 10;
  pinChannelNum = 0;
  public channels: Array<channelDTO> = [];
  search: FormGroup;
  domainName = DomainName;
  direction = TextDirectionController.textDirection;
  typeFilter = null;
  leftSidebarWidth: number;

  textDirection = TextDirectionController.textDirection;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  constructor(
    private chatService: ChatService,
    private chatDataService: ChatDataService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getChannels();
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]],
    });
    this.chatDataService.currentActiveChannel.subscribe((activeChannel) => {
      if (activeChannel != null) {
        this.activeChannel = activeChannel;
        this.activeChannelGuid = activeChannel.guid;
      } else {
        this.activeChannelGuid = '0';
        this.activeChannel = null;
      }
    });

    this.chatDataService.currentchangeRecieveOnlineMessage.subscribe((l) => {
      if (l != null) {
        this.channels.forEach(c => {
          // @ts-ignore
          if ( c.guid === l[0]) {
            c.isOnline = l[1];
          }
          // if (this.activeChannel.guid === l[0]) {
          //   this.activeChannel.isOnline = l[1];
          // }
        });
      }
    });

    this.chatDataService.currentUnSeenMessageMessage.subscribe((message) => {
      if (message !== null) {
        if (!message.isSentFromMe) {
          if (
            this.activeChannel === null ||
            this.activeChannel.guid !== message.channelId
          ) {
            this.channels.forEach((e) => {
              if (this.activeChannel == null && e.guid === message.channelId) {
                e.numberOfUnreadMessages++;
              }
            });
          }
        }
        this.chatDataService.changeUnSeenMessage(null);
      }
    });

    this.chatDataService.currentSortChannel.subscribe((channelId) => {
      if (channelId != null) {
        this.pinChannelNum = 0;
        this.channels.forEach((e) => {
          if (e.isPinned) {
            const index: number = this.channels.indexOf(e);
            this.channels.splice(index, 1);
            this.channels.splice(this.pinChannelNum, 0, e);
            this.pinChannelNum++;
          }
        });
        this.channels.forEach((e) => {
          if (e.guid === channelId[0] && !e.isPinned) {
            const index: number = this.channels.indexOf(e);
            this.channels[index].lastMessage = new LastMessageInChannelDTO(
              channelId[1].fromNickName,
              channelId[1].fromUserId,
              channelId[1].body,
              this.changeTime(channelId[1].sentOn),
              channelId[1].messageTypeId
            );
            this.channels.splice(index, 1);
            this.channels.splice(this.pinChannelNum, 0, e);
          }
        });
      }
    });
  }

  onResized(event: ResizedEvent) {
    this.leftSidebarWidth = event.newWidth;
  }

  changeTime(time) {
    const temp = time.toString().split('.')[0].split('T');
    const timeChanged = new Date(
      temp[0].split('-')[1] +
        '/' +
        temp[0].split('-')[2] +
        '/' +
        temp[0].split('-')[0] +
        ' ' +
        temp[1].split(':')[0] +
        ':' +
        temp[1].split(':')[1] +
        ':' +
        temp[1].split(':')[2] +
        ' UTC'
    );
    const currentDate = new Date();
    const diffDays = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          timeChanged.getFullYear(),
          timeChanged.getMonth(),
          timeChanged.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) {
      return this.datePipe.transform(timeChanged, 'H:mm');
    } else if (diffDays < 7) {
      return diffDays + 'd';
    } else {
      if (Math.floor(diffDays / 7) < 52) {
        return Math.floor(diffDays / 7) + 'w';
      } else {
        return Math.floor(diffDays / 7 / 52) + 'y';
      }
    }
  }

  getChannels(): void {
    this.chatService.getChannels().subscribe((res) => {
      this.showGetChannelsLoading = false;
      // this.channels = res.value;
      for (let i = 0; i < res.value.length; i++) {
        if (res.value[i].lastMessage != null) {
          res.value[i].lastMessage.sendOn = this.changeTime(
            res.value[i].lastMessage.sendOn
          );
        }
        this.channels.push(
          new channelDTO(
            res.value[i].guid,
            res.value[i].title,
            res.value[i].profileImageGuid,
            res.value[i].channelTypeId,
            res.value[i].isMuted,
            res.value[i].isPinned,
            res.value[i].isOnline,
            res.value[i].evenOrder,
            this.changeTime(res.value[i].lastTransactionDateTime),
            res.value[i].numberOfUnreadMessages,
            res.value[i].lastMessage
          )
        );
      }
    });
  }

  selectActiveChannel(channel: channelDTO) {
    if (this.activeChannel === null || (this.activeChannel !== null && channel.guid !== this.activeChannel.guid)) {
      this.chatDataService.changeActiveChannel(channel);
      channel.numberOfUnreadMessages = 0;
      this.activeChannelGuid = channel.guid;
    }
  }

  searchFieldChanged(): void {
    if (this.search.controls.searchField.value) {
      for (let i = 0; i < this.channels.length; i++) {
        if (
          !this.channels[i].title
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
          $('#' + this.channels[i].guid).hide();
        }
        if (
          this.channels[i].title
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
          $('#' + this.channels[i].guid).show();
        }
      }
    } else {
      for (let i = 0; i < this.channels.length; i++) {
        $('#' + this.channels[i].guid).show();
      }
    }
    // if (this.search.controls.searchField.value) {
    //   for (let i = 0; i < this.channels.length; i++) {
    //     if (!this.channels[i].title.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
    //       $('#' + this.channels[i].guid + 'pin').hide();
    //     }
    //     if (this.channels[i].title.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
    //       $('#' + this.channels[i].guid + 'pin').show();
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < this.channels.length; i++) {
    //     $('#' + this.channels[i].guid + 'pin').show();
    //   }
    // }
  }
}
