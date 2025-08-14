import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';
import {channelDTO} from '../../../../DTOs/chat/ChannelDTO';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomainName} from '../../../../utilities/PathTools';
import {ChatService} from '../../../../services/chatService/chat.service';
import {ChatDataService} from '../../../../services/dataService/chatDataService/chat-data.service';
import * as $ from 'jquery';
import {MatDialog} from '@angular/material/dialog';
import {FileService} from '../../uploadFile/fileService/file.service';
import {UserDTO} from '../../../../DTOs/user/UserDTO';
import {messageDTO} from '../../../../DTOs/chat/MessageDTO';
import {GetMessageParametersDTO} from '../../../../DTOs/chat/GetMessageParametersDTO';
import {UploadResponseModel} from '../../../../DTOs/responseModel/UploadResponseModel';
import {DeleteMessageVerificationDialog} from '../../../../pages/chatRoom/chat-room.component';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {LastMessageInChannelDTO} from '../../../../DTOs/chat/LastMessageInChannelDTO';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../../../services/settingsService/settings.service';
import {TemplatePortal} from '@angular/cdk/portal';
import {filter, take} from 'rxjs/operators';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ResizedEvent} from 'angular-resize-event';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {ChannelMemberListDialogComponent} from '../../channel-member-list-dialog/channel-member-list-dialog.component';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sticky-chat-right-nav-bar',
  templateUrl: './sticky-chat-right-nav-bar.component.html',
  animations: [
    trigger('valueChange', [
      transition('void => *', []),
      transition('* => void', []),
      transition('* => *', [
        animate(
          330,
          keyframes([
            style({opacity: 0, offset: 0.0}),
            style({opacity: 1, offset: 1.0}),
          ])
        ),
      ]),
    ]),
  ],
  styleUrls: ['./sticky-chat-right-nav-bar.component.scss'],
})
export class StickyChatRightNavBarComponent implements OnInit, AfterViewInit {
  constructor(
    private chatService: ChatService,
    private chatDataService: ChatDataService,
    private _formBuilder: FormBuilder,
    private directionService: DirectionService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private fileService: FileService,
    public overlay: Overlay,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    public translateService: TranslateService,
    public viewContainerRef: ViewContainerRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  activeChannelGuid = '0';
  activeTab = 'All';
  typeFilter = null;
  activeChannel: channelDTO = null;
  forwardChannel: channelDTO = null;
  height = window.innerHeight - 115;
  // chatHeight = window.innerHeight - 150;
  pinChannelNum = 0;
  public channels: Array<channelDTO> = [];
  search: FormGroup;
  textDirection = TextDirectionController.textDirection;
  domainName = DomainName;
  selectTab = 'channel';
  /////////////////////////////////////////
  mainCardHeight = window.innerHeight - 80;
  pastActiveChannel: channelDTO;

  replay = false;
  replayFormGroup: FormGroup;

  editFormGroup: FormGroup;
  edit = false;

  moreButton = false;
  moreButtonID = -1;

  showGetMessagesLoading = false;

  newMessageWithEmoji = '';
  emojiPickerColor: string;

  uploadPercentage = 0;
  uploadFileLength = 0;

  private scrollContainer: any;
  private isNearBottom = true;
  messagesArray: Array<messageDTO> = [];
  chatFormGroup: FormGroup;

  isFileOver = false;
  isHover = false;

  iconRotationDegree = 0;

  showGetChannelsLoading = true;
  rightSidebarWidth: number;
  /* scroll */
  scrollLastNumber: number;
  scrollCounter: number;
  scrollInFirst: boolean;
  scrollRemoteTop: number[];

  showPreview = false;
  previewAddress = '';
  /*  */

  public scrollNow = new Subject();

  @ViewChild('messageTextArea') private messageTextArea: ElementRef;
  // @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  @ViewChild('userMenu') userMenu: TemplateRef<any>;

  overlayRef: OverlayRef | null;

  sub: Subscription;

  ngOnInit(): void {
    /* scroll */
    this.scrollLastNumber = 0;
    this.scrollCounter = 0;
    this.scrollInFirst = true;
    this.scrollRemoteTop = [];
    /*  */
    this.emojiPickerColor =
      SettingsService.getSettingsFromLocalStorage().themeColor;
    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });
    this.getChannels();
    this.search = this._formBuilder.group({
      searchField: ['', [Validators.required]],
    });
    // this.chatDataService.currentActiveChannel.subscribe(activeChannel => {
    //   if (activeChannel != null) {
    //     this.activeChannel = activeChannel;
    //   }
    // });

    this.chatDataService.currentchangeRecieveOnlineMessage.subscribe((l) => {
      if (l != null) {
        this.channels.forEach(c => {
          // @ts-ignore
          if (c.guid === l[0]) {
            c.isOnline = l[1];
          }
          if (this.activeChannel !== null) {
            if (this.activeChannel.guid === l[0]) {
              this.activeChannel.isOnline = l[1];
            }
          }
        });
      }
    });

    this.chatDataService.currentUnSeenMessageMessage.subscribe((message) => {
      if (message !== null) {
        if (!message.isSentFromMe) {
          // console.log(this.activeChannel);
          if (
            this.activeChannel === null ||
            this.activeChannel.guid !== message.channelId
          ) {
            this.channels.forEach((e) => {
              if (e.guid === message.channelId) {
                // console.log(e.numberOfUnreadMessages);
                e.numberOfUnreadMessages++;
                this.chatDataService.changeUnSeenMessage(null);
              }
            });
          }
        }
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
    //
    //
    // // this.chatDataService.currentActiveChannel.subscribe(activeChannel => {
    // //   if (activeChannel !== null) {
    // //     // this.messagesArray.length = 0;
    // //     this.activeChannel = activeChannel;
    // //     if (activeChannel.channelTypeId !== 1) {
    // //       if (!this.membersProfile.get(activeChannel.guid)) {
    // //         this.chatService.getChannelMembers(activeChannel.guid, activeChannel.channelTypeId).subscribe(res => {
    // //           const map = new Map<string, UserDTO>();
    // //           for (let i = 0; i < res.value.length; i++) {
    // //             map.set(res.value[i].userId, res.value[i]);
    // //           }
    // //           this.membersProfile.set(activeChannel.guid, map);
    // //           console.log(this.membersProfile);
    // //         });
    // //       }
    // //     }
    // //     this.getMessage();
    // //     this.chatDataService.changeActiveChannel(null);
    // //   }
    // // });
    //
    this.chatDataService.currentDeletedMessage.subscribe((messageID) => {
      if (messageID !== null) {
        this.messagesArray.forEach((e) => {
          if (e.messageID === messageID) {
            const index: number = this.messagesArray.indexOf(e);
            this.messagesArray.splice(index, 1);
          }
        });
        this.chatDataService.changeDeletedMessage(null);
      }
    });
    //
    this.chatDataService.currentEditedMessage.subscribe((editedMessage) => {
      if (editedMessage !== null) {
        this.messagesArray.forEach((e) => {
          if (e.messageID === editedMessage[0]) {
            e.body = editedMessage[1];
            e.isEdited = true;
          }
        });
        this.chatDataService.changeEditedMessage(null);
      }
    });
    //
    this.chatDataService.currentSendMessage.subscribe((message) => {
    });
    //
    this.chatDataService.currentReceiveMessage.subscribe((message) => {
      if (this.activeChannel !== null && message !== null) {
        if (message.isForwarded) {
          this.selectActiveChannel(this.forwardChannel);
          this.forwardChannel = null;
        } else if (message.channelId === this.activeChannel.guid) {
          this.messagesArray.push(message);
          // console.log(message);
        }
      }
    });

    this.chatFormGroup = this._formBuilder.group({
      newMessage: ['', [Validators.required]],
    });

    this.replayFormGroup = this._formBuilder.group({
      replayBody: [],
      replayUserName: [],
      replayMessageId: [],
      replayMessageTypeId: [],
    });

    this.editFormGroup = this._formBuilder.group({
      editBody: [],
      editMessageId: [],
      editChannelId: [],
    });
  }

  onResized(event: ResizedEvent) {
    this.rightSidebarWidth = event.newWidth - 10;
    // resize selectedDate
    const item = this.el?.nativeElement.querySelector('.selectedDate');
    if (item) {
      this.renderer.setStyle(item, 'width', `${this.rightSidebarWidth}` + 'px');
    }
  }

  changeValue() {
    this.selectTab = 'channel';
    this.activeChannel = null;
    this.pastActiveChannel = null;
    /* scroll */
    this.scrollLastNumber = 0;
    this.scrollCounter = 0;
    this.scrollInFirst = true;
    this.scrollRemoteTop = [];
    /*  */
  }

  /* Scroll And Fix Date Top on the card-body */
  onContainerScroll(event) {
    const element = this.el.nativeElement.querySelectorAll('.header-message');
    const scrollState =
      this.scrollLastNumber - (event.target as Element).scrollTop < 0
        ? '+'
        : '-';
    if (this.scrollInFirst) {
      for (let i = 0; i < element.length; i++) {
        if (element[i].offsetTop >= (event.target as Element).scrollTop) {
          break;
        }
        this.scrollRemoteTop[i] = element[i].offsetTop;
        this.scrollCounter = i;
        this.scrollInFirst = false;
      }
      this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
      this.renderer.setStyle(
        element[this.scrollCounter],
        'width',
        `${this.rightSidebarWidth}` + 'px'
      );
    }
    if (scrollState === '+') {
      /*  */
      if (
        (event.target as Element).scrollTop <=
        this.scrollRemoteTop[this.scrollCounter + 1] - 70
      ) {
        this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
        this.renderer.setStyle(
          element[this.scrollCounter],
          'width',
          `${this.rightSidebarWidth}` + 'px'
        );
      } else if (
        (event.target as Element).scrollTop >=
        this.scrollRemoteTop[this.scrollCounter + 1] - 50
      ) {
        this.renderer.removeClass(element[this.scrollCounter], 'selectedDate');
        this.scrollCounter++;
        this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
        this.renderer.setStyle(
          element[this.scrollCounter],
          'width',
          `${this.rightSidebarWidth}` + 'px'
        );
      }
      /*  */
    } else if (scrollState === '-') {
      /*  */
      if (this.scrollCounter < 1) {
        if ((event.target as Element).scrollTop <= 14) {
          this.renderer.removeClass(element[0], 'selectedDate');
        }
      } else if (
        (event.target as Element).scrollTop <=
        this.scrollRemoteTop[this.scrollCounter] - 80
      ) {
        this.renderer.removeClass(element[this.scrollCounter], 'selectedDate');
        this.scrollCounter--;
        this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
        this.renderer.setStyle(
          element[this.scrollCounter],
          'width',
          `${this.rightSidebarWidth}` + 'px'
        );
      }
      /*  */
    }
    /*  */
    this.scrollLastNumber = (event.target as Element).scrollTop;
  }

  /*  */

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

  public addEmoji(event) {
    if (!this.newMessageWithEmoji) {
      this.newMessageWithEmoji = '';
    }
    this.chatFormGroup.controls.newMessage.setValue(
      `${this.newMessageWithEmoji}${event.emoji.native}`
    );
  }

  getChannels(): void {
    this.chatService.getChannels().subscribe((res) => {
      this.showGetChannelsLoading = false;
      // this.channels = res.value;
      for (let i = 0; i < res.value.length; i++) {
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
    // this.chatDataService.changeActiveChannel(channel);
    this.showGetMessagesLoading = true;
    this.selectTab = 'chat';
    this.activeChannel = channel;
    channel.numberOfUnreadMessages = 0;
    this.activeChannelGuid = channel.guid;
    this.getMessage();
  }

  searchFieldChanged(): void {
    if (this.search.controls.searchField.value) {
      for (let i = 0; i < this.channels.length; i++) {
        if (
          !this.channels[i].title
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
          console.log($('#' + this.channels[i].guid + 'inSticky').hide());
          $('#' + this.channels[i].guid + 'inSticky').hide();
        }
        if (
          this.channels[i].title
            .toLowerCase()
            .match(this.search.controls.searchField.value.toLowerCase())
        ) {
          $('#' + this.channels[i].guid + 'inSticky').show();
        }
      }
    } else {
      for (let i = 0; i < this.channels.length; i++) {
        $('#' + this.channels[i].guid + 'inSticky').show();
      }
    }
    // if (this.search.controls.searchField.value) {
    //   for (let i = 0; i < this.channels.length; i++) {
    //     if (!this.channels[i].title.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
    //       $('#' + this.channels[i].guid + 'pin' + 'inSticky').hide();
    //     }
    //     if (this.channels[i].title.toLowerCase().match(this.search.controls.searchField.value.toLowerCase())) {
    //       $('#' + this.channels[i].guid + 'pin' + 'inSticky').show();
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < this.channels.length; i++) {
    //     $('#' + this.channels[i].guid + 'pin' + 'inSticky').show();
    //   }
    // }
  }

  isMessageOnlyEmoji(message: string) {
    // console.log(message.match(/./gu).length);
    const emoji_regex =
      /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
    return emoji_regex.test(message) && message.match(/./gu).length === 1;
  }

  //////////////////////////////////////////
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.activeChannel = null;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mainCardHeight = event.target.innerHeight - 80;
    this.height = event.target.innerHeight - 80;
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  // private isUserNearBottom(): boolean {
  //   const threshold = 150;
  //   const position =
  //      this.scrollContainer.offsetHeight;
  //   const height = this.scrollContainer.scrollHeight;
  //   return position > height - threshold;
  // }

  ngAfterViewInit() {
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  // scrolled(event: any): void {
  //   this.isNearBottom = this.isUserNearBottom();
  // }

  getMessage() {
    this.replay = false;
    this.edit = false;
    this.chatFormGroup.reset();
    this.replayFormGroup.reset();
    this.editFormGroup.reset();
    if (
      this.pastActiveChannel === null ||
      this.pastActiveChannel !== this.activeChannel
    ) {
      this.messagesArray.length = 0;
      const ss = new GetMessageParametersDTO(
        this.activeChannel.guid,
        this.activeChannel.channelTypeId,
        '1',
        '1'
      );
      let last;
      this.chatService.getMessage(ss).subscribe((res) => {
        for (let i = 0; i < res.value.length; i++) {
          const temp = res.value[i].sendOn.toString().split('.')[0].split('T');
          const time = new Date(
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
          this.messagesArray.push(
            new messageDTO(
              res.value[i].id,
              res.value[i].body,
              res.value[i].messageTypeId,
              res.value[i].sendFromMe,
              this.activeChannel.channelTypeId,
              this.activeChannel.guid,
              time,
              res.value[i].fromNickName,
              res.value[i].fromUserId,
              res.value[i].fromUserImageId,
              res.value[i].replyTo,
              res.value[i].isEdited,
              res.value[i].isPinned,
              res.value[i].isForwarded,
              res.value[i].forwardedFrom
            )
          );
          if (i === res.value.length - 1) {
            last = res.value[i].id;
            this.chatDataService.changeSeenMessage(res.value[i].id);
          }
        }
        this.pastActiveChannel = this.activeChannel;
        setTimeout(() => {
          // this.isNearBottom = true;
          // this.scrollContainer = this.scrollFrame.nativeElement;
          // this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
          this.messageTextArea.nativeElement.focus();
        }, 500);
        this.showGetMessagesLoading = false;
      });
    }
  }

  resetIfMessageIsEmpty() {
    // const msg = this.chatFormGroup.controls.newMessage.value;
    // console.log(msg);
    // if (msg.toString().match(/^\s*$/) !== null) {
    //   this.chatFormGroup.reset();
    // }
    this.chatFormGroup.reset();
  }

  sendWithEnter(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      this.sendOrEditMessage();
    } else {
    }
  }

  sendOrEditMessage() {
    const msg = this.chatFormGroup.controls.newMessage.value;

    if (this.edit) {
      if (msg.match(/^\s*$/) === null) {
        const editedMessage = [
          this.editFormGroup.controls.editMessageId.value,
          msg,
        ];
        this.chatDataService.changeEditedMessage(editedMessage);
        this.chatFormGroup.controls.newMessage.setValue('');
        this.chatFormGroup.reset();
        this.editFormGroup.reset();
        this.replayFormGroup.reset();
        this.edit = false;
      } else {
        this.chatFormGroup.controls.newMessage.setValue('');
        this.chatFormGroup.reset();
      }
      this.messageTextArea.nativeElement.focus();
    } else {
      if (msg.match(/^\s*$/) === null) {
        let replayTo = null;
        if (this.replayFormGroup.controls.replayMessageId.value) {
          replayTo = this.replayFormGroup.controls.replayMessageId.value;
        }
        this.chatDataService.changeCurrentSendMessage([
          msg,
          this.activeChannel.channelTypeId,
          this.activeChannel.guid,
          1,
          replayTo,
        ]); // TODO: change messagetypeid
        this.chatFormGroup.controls.newMessage.setValue('');
        this.replayFormGroup.reset();
        this.editFormGroup.reset();
        this.replay = false;
        this.edit = false;
        this.chatFormGroup.reset();
      } else {
        this.chatFormGroup.controls.newMessage.setValue('');
        this.chatFormGroup.reset();
      }
      this.messageTextArea.nativeElement.focus();
      // if (this.isUserNearBottom()) {
      //   // this.scrollContainer = this.scrollFrame.nativeElement;
      //   // this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
      //   // setTimeout(() => {
      //   // }, 0.1);
      // }
    }
  }

  clickSelectFile(): void {
    $('#file').click();
  }

  uploadedFile(event: UploadResponseModel) {
    this.isNearBottom = true;
    // this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe((_) => this.onItemElementsChanged());
    // console.log(event);
    for (let i = 0; i < event.value.successfulFileUpload.length; i++) {
      this.chatDataService.changeCurrentSendMessage([
        event.value.successfulFileUpload[i].fileContainerGuid +
        ':/:' +
        event.value.successfulFileUpload[i].name +
        ':/:' +
        event.value.successfulFileUpload[i].extension +
        ':/:' +
        event.value.successfulFileUpload[i].size,
        this.activeChannel.channelTypeId,
        this.activeChannel.guid,
        this.typeFinder(event.value.successfulFileUpload[i].extension),
        null,
      ]);
    }
  }

  typeFinder(type) {
    if (
      type === 'jpg' ||
      type === 'png' ||
      type === 'jpeg' ||
      type === 'tiff' ||
      type === 'svg' ||
      type === 'gif'
    ) {
      return 2;
    } else if (type === 'mp3' || type === 'm4a' || type === 'wav') {
      return 3;
    } else if (
      type === 'mp4' ||
      type === 'mov' ||
      type === 'm4v' ||
      type === 'avi' ||
      type === 'mpg' ||
      type === 'flv'
    ) {
      return 4;
    } else {
      return 5;
    }
  }

  messageFinder(id) {
    for (let a = 0; a < this.messagesArray.length; a++) {
      if (this.messagesArray[a].messageID === id) {
        return this.messagesArray[a];
      }
    }
    return false;
  }

  scroll(id) {
    const el = document.getElementById(id);
    el?.scrollIntoView();
  }

  replayMsg(message): void {
    if (this.edit) {
      this.chatFormGroup.reset();
      this.edit = false;
      this.editFormGroup.reset();
    }
    this.replay = true;
    this.replayFormGroup.controls.replayBody.setValue(message.body);
    this.replayFormGroup.controls.replayMessageId.setValue(message.messageID);
    this.replayFormGroup.controls.replayUserName.setValue(message.fromNickName);
    this.replayFormGroup.controls.replayMessageTypeId.setValue(
      message.messageTypeId
    );
    this.messageTextArea.nativeElement.focus();
  }

  editMsg(message: messageDTO): void {
    this.close();
    this.replay = false;
    this.replayFormGroup.reset();
    this.edit = true;
    this.editFormGroup.controls.editBody.setValue(message.body);
    this.editFormGroup.controls.editMessageId.setValue(message.messageID);
    this.editFormGroup.controls.editChannelId.setValue(message.channelId);
    this.chatFormGroup.controls.newMessage.setValue(message.body);
    this.messageTextArea.nativeElement.focus(message.body.length);
    this.messageTextArea.nativeElement.selectionEnd = message.body.length;
    // this.messageTextArea.nativeElement.end(message.body.length);
  }

  async clipboardCopy(text) {
    this.clipboard.copy(text);
    this._snackBar.open(
      await this.translateService.get('Snackbar.copyToClipboard').toPromise(),
      await this.translateService.get('Buttons.gotIt').toPromise(),
      {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction:
          TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
      }
    );
  }

  deleteMsg(messageID): void {
    // this.chatDataService.changeDeletedMessage(messageID);
  }

  openMoreButton(messageID) {
    this.moreButton = true;
    this.moreButtonID = messageID;
  }

  closeMoreButton() {
    this.moreButton = false;
    this.moreButtonID = -1;
  }

  openDeleteDialog(message: messageDTO) {
    const tempMessage: messageDTO = {...message};
    if (
      this.replayFormGroup.controls.replayMessageId.value === message.messageID
    ) {
      this.replay = false;
      this.replayFormGroup.reset();
    }
    if (tempMessage.messageTypeId !== 1) {
      tempMessage.body = message.body.split(':/:')[1];
    }
    const dialogRef = this.dialog.open(DeleteMessageVerificationDialog, {
      minWidth: '100px',
      // height: '400px',
      data: {
        dataKey: tempMessage,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  openChannelList(message: messageDTO) {
    const dialogRef = this.dialog.open(ChannelMemberListDialogComponent, {
      // minWidth: '100px',
      // maxHeight: '500px',
      data: {
        // dataKey: tempMessage,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.chatDataService.changeCurrentForwardMessage([message, result]);
        this.forwardChannel = result;
        this.showGetMessagesLoading = true;
      }
    });
  }

  openContextMenu({x, y}: MouseEvent, message) {
    this.close();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({x, y})
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.attach(
      new TemplatePortal(this.userMenu, this.viewContainerRef, {
        $implicit: message,
      })
    );

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const clickTarget = event.target as HTMLElement;
          return (
            !!this.overlayRef &&
            !this.overlayRef.overlayElement.contains(clickTarget)
          );
        }),
        take(1)
      )
      .subscribe(() => this.close());
  }

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  fileOver(event) {
    this.isFileOver = event;
    if (!this.isFileOver) {
      this.isHover = false;
    }
  }

  getUploadProgress(event) {
    this.uploadPercentage = event;
  }

  getUploadFileLength(event) {
    if (event === 0) {
      setTimeout(() => {
        this.uploadFileLength = 0;
        this.uploadPercentage = 0;
      }, 700);
    } else {
      this.uploadFileLength = event;
    }
  }

  cradBodyHover(event) {
    this.isHover = event;
  }
}
