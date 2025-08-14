import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {ChatDataService} from '../../services/dataService/chatDataService/chat-data.service';
import {channelDTO} from '../../DTOs/chat/ChannelDTO';
import {GetMessageParametersDTO} from '../../DTOs/chat/GetMessageParametersDTO';
import {messageDTO} from '../../DTOs/chat/MessageDTO';
import {ChatService} from '../../services/chatService/chat.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as $ from 'jquery';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomainName} from '../../utilities/PathTools';
import {UploadResponseModel} from '../../DTOs/responseModel/UploadResponseModel';
import {FileService} from '../../primaryPages/sharedComponents/uploadFile/fileService/file.service';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {DirectionService} from '../../services/directionService/direction.service';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {SettingsService} from '../../services/settingsService/settings.service';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {filter, take} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {
  fade,
  fadeInOutAnimation,
  listAnimationReversed,
  listFade,
  chatAnimation,
} from 'src/animations/animations';
import {ChannelMemberListDialogComponent} from '../../primaryPages/sharedComponents/channel-member-list-dialog/channel-member-list-dialog.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    listAnimationReversed,
    fade,
    fadeInOutAnimation,
    listFade,
    chatAnimation,
  ],
})
export class ChatRoomComponent implements OnInit, AfterViewInit {
  constructor(
    private chatDataService: ChatDataService,
    private chatService: ChatService,
    private _formBuilder: FormBuilder,
    private directionService: DirectionService,
    public dialog: MatDialog,
    private fileService: FileService,
    public overlay: Overlay,
    private _snackBar: MatSnackBar,
    public translateService: TranslateService,
    private clipboard: Clipboard,
    public viewContainerRef: ViewContainerRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @ViewChild('userMenu') userMenu: TemplateRef<any>;

  isFileOver = false;
  isHover = false;
  chatAnimationMode = 'loadMessages';

  overlayRef: OverlayRef | null;

  showGetMessagesLoading = false;

  height = window.innerHeight - 430;
  mainCardHeight = window.innerHeight - 130;
  width = window.innerWidth - window.innerWidth * 0.55;

  activeChannel: channelDTO = null;
  forwardChannel: channelDTO = null;
  pastActiveChannel: channelDTO;

  replay = false;
  replayFormGroup: FormGroup;

  editFormGroup: FormGroup;
  edit = false;

  moreButton = false;
  moreButtonID = -1;

  showPreview = false;
  previewAddress = '';

  newMessageWithEmoji = '';

  uploadPercentage = 0;
  uploadFileLength = 0;

  private scrollContainer: any;
  private isNearBottom = true;

  messagesArray: Array<messageDTO> = [];
  pinnedMessagesArray: Array<messageDTO> = [];

  chatFormGroup: FormGroup;
  domainName = DomainName;

  iconRotationDegree = TextDirectionController.iconRotationDegree;

  public scrollNow = new Subject();

  emojiPickerColor: string;

  pendingMessages = [];

  /* scroll */
  scrollLastNumber: number;
  scrollCounter: number;
  scrollInFirst: boolean;
  scrollRemoteTop: number[];
  containerWidth: number;
  /*  */

  @ViewChild('messageTextArea') private messageTextArea: ElementRef;
  // @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  sub: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight - 430;
    this.mainCardHeight = event.target.innerHeight - 130;
    this.width = event.target.innerWidth - window.innerWidth * 0.55;
  }

  ngOnInit(): void {
    /* scroll */
    this.scrollLastNumber = 0;
    this.scrollCounter = 0;
    this.scrollInFirst = true;
    this.scrollRemoteTop = [];
    this.containerWidth = 810;
    /*  */
    this.emojiPickerColor =
      SettingsService.getSettingsFromLocalStorage().themeColor;

    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });
    this.chatFormGroup = this._formBuilder.group({
      newMessage: ['', [Validators.required]],
    });

    this.chatDataService.currentActiveChannel.subscribe((activeChannel) => {
      if (activeChannel !== null) {
        this.showGetMessagesLoading = true;
        // this.messagesArray.length = 0;
        if (activeChannel !== this.activeChannel) {
          this.activeChannel = activeChannel;
          this.getMessage(activeChannel);
        }
        // this.chatDataService.changeActiveChannel(null);
      }
    });

    this.chatDataService.currentDeletedMessage.subscribe((messageID) => {
      if (messageID !== null) {
        this.messagesArray.forEach((e) => {
          if (e.messageID === messageID) {
            const index: number = this.messagesArray.indexOf(e);
            this.messagesArray.splice(index, 1);
            if (e.isPinned) {
              const i: number = this.pinnedMessagesArray.indexOf(e);
              this.pinnedMessagesArray.splice(i, 1);
            }
          }
        });
        this.chatDataService.changeDeletedMessage(null);
      }
    });

    this.chatDataService.currentReceivedEditedMessage.subscribe(
      (editedMessage) => {
        if (editedMessage !== null) {
          this.messagesArray.forEach((e) => {
            if (e.messageID === editedMessage[0]) {
              e.body = editedMessage[1];
              e.isEdited = true;
              if (e.isPinned) {
                const i: number = this.pinnedMessagesArray.indexOf(e);
                this.pinnedMessagesArray[i] = e;
              }
            }
          });
          this.chatDataService.changeReceivedEditedMessage(null);
        }
      }
    );

    this.chatDataService.currentSendMessage.subscribe((message) => {
      // console.log(message);
    });

    this.chatDataService.currentReceiveMessage.subscribe((newMessage) => {
      if (this.activeChannel !== null && newMessage !== null) {
        if (newMessage.isForwarded) {
          this.chatDataService.changeActiveChannel(this.forwardChannel);
          this.forwardChannel = null;
        }
        if (newMessage.channelId === this.activeChannel.guid) {
          // this.messagesArray.push(newMessage);
          if (newMessage.messageTypeId.toString() !== '1') {
            this.messagesArray.push(newMessage);
          } else {
            if (newMessage.isSentFromMe) {
              for (let i = 0; i < this.messagesArray.length; i++) {
                if (
                  this.messagesArray[i].messageID.toString() === '-1' &&
                  this.messagesArray[i].body === newMessage.body
                ) {
                  this.messagesArray[i].messageID = newMessage.messageID;
                  this.messagesArray[i].sentOn = newMessage.sentOn;
                  this.messagesArray[i].fromNickName = newMessage.fromNickName;
                  this.messagesArray[i].fromUserId = newMessage.fromUserId;
                  this.messagesArray[i].fromUserImageId =
                    newMessage.fromUserImageId;
                  this.messagesArray[i].forwardedFrom =
                    newMessage.forwardedFrom;
                  break;
                }
              }
            } else {
              this.messagesArray.push(newMessage);
            }
          }
        }
      }
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    if (this.edit || this.replay) {
      this.edit = false;
      this.editFormGroup.reset();
      this.chatFormGroup.reset();
      this.replay = false;
      this.replayFormGroup.reset();
    } else {
      this.activeChannel = null;
      this.chatDataService.changeActiveChannel(null);
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  ngAfterViewInit() {
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  getMessage(activeChannel) {
    /* scroll */
    this.scrollLastNumber = 0;
    this.scrollCounter = 0;
    this.scrollInFirst = true;
    this.scrollRemoteTop = [];
    /*  */
    this.chatAnimationMode = 'loadMessages';
    this.replay = false;
    this.edit = false;
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
    const ss = new GetMessageParametersDTO(
      activeChannel.guid,
      activeChannel.channelTypeId,
      '1',
      '1'
    );
    let last;
    this.chatService.getMessage(ss).subscribe(async (res) => {
      if (activeChannel.guid === this.activeChannel.guid) {
        this.messagesArray = [];
        this.pinnedMessagesArray = [];
        this.messagesArray.length = 0;
        this.pinnedMessagesArray.length = 0;
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
          const newMessage = new messageDTO(
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
          );
          this.messagesArray.push(newMessage);
          if (newMessage.isPinned) {
            this.pinnedMessagesArray.push(newMessage);
          }
          if (i === res.value.length - 1) {
            last = res.value[i].id;
            this.chatDataService.changeSeenMessage(res.value[i].id);
          }
        }
        this.pastActiveChannel = this.activeChannel;
        setTimeout(() => {
          this.isNearBottom = true;
          // this.scrollContainer = this.scrollFrame.nativeElement;
          // this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
          this.messageTextArea.nativeElement.focus();
        }, 500);
        this.showGetMessagesLoading = false;
      }
    });
  }

  shiftPinMessageArray() {
    const temp = this.pinnedMessagesArray.shift();
    this.pinnedMessagesArray.push(temp);
    this.scroll(this.pinnedMessagesArray[0].messageID);
  }

  resetIfMessageIsEmpty() {
    const msg = this.chatFormGroup.controls.newMessage.value;
    if (msg != null && msg.match(/^\s*$/) !== null) {
      this.chatFormGroup.reset();
    }
  }

  sendWithEnter(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      this.sendOrEditMessage();
    } else {
    }
  }

  sendOrEditMessage() {
    this.chatAnimationMode = 'newMessage';
    const msg = this.chatFormGroup.controls.newMessage.value;
    const time = new Date();

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
        const tempMessage = new messageDTO(
          '-1',
          msg,
          1,
          true,
          this.activeChannel.channelTypeId,
          this.activeChannel.guid,
          time,
          '',
          '',
          '',
          replayTo,
          false,
          false,
          false,
          null
        );
        this.messagesArray.push(tempMessage);
        // tslint:Disable-next-line:max-line-length
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
      if (this.isUserNearBottom()) {
        // this.scrollContainer = this.scrollFrame.nativeElement;
        // this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
        setTimeout(() => {
        }, 0.1);
      }
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
    // const el = document.getElementById(id);
    // if (el) {
    //   el.scrollIntoView({ behavior: 'smooth' });
    // }
  }

  public addEmoji(event) {
    // console.log(this.newMessageWithEmoji);
    // console.log(event.emoji.native);
    if (!this.newMessageWithEmoji) {
      this.newMessageWithEmoji = '';
    }
    this.chatFormGroup.controls.newMessage.setValue(
      `${this.newMessageWithEmoji}${event.emoji.native}`
    );
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

  focusOnTextbox() {
    this.messageTextArea.nativeElement.focus();
    console.log('focus');
  }

  pinMessage(message: messageDTO) {
    message.isPinned = true;
    this.pinnedMessagesArray.push(message);
    this.chatDataService.changePinMessage(message);
  }

  unpinMessage(message: messageDTO) {
    message.isPinned = false;
    const index: number = this.pinnedMessagesArray.indexOf(message);
    this.pinnedMessagesArray.splice(index, 1);
    this.chatDataService.changeUnPinMessage(message);
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

  deleteMsg(messageID): void {
    this.chatDataService.changeDeletedMessage(messageID);
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

  typeDetector(name: string) {
    const temp = name.split('.');
    return temp[temp.length - 1].toLowerCase();
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

  isMessageOnlyEmoji(message: string) {
    // console.log(message.match(/./gu).length);
    const emoji_regex =
      /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
    return emoji_regex.test(message) && message.match(/./gu).length === 1;
  }

  close() {
    // tslint:disable-next-line:no-unused-expression
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
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
        this.containerWidth = event.target.clientWidth - 40;
        this.scrollInFirst = false;
      }
      this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
      this.renderer.setStyle(
        element[this.scrollCounter],
        'width',
        `${this.containerWidth}` + 'px'
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
          `${this.containerWidth}` + 'px'
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
          `${this.containerWidth}` + 'px'
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
          `${this.containerWidth}` + 'px'
        );
      }
      /*  */
    }
    /*  */
    this.scrollLastNumber = (event.target as Element).scrollTop;
  }

  /*  */
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-message-verification',
  templateUrl: 'delete-message-verification.html',
  styleUrls: ['./delete-message-verification-style.scss'],
})

// tslint:Disable-next-line:component-class-suffix
// tslint:disable-next-line:component-class-suffix
export class DeleteMessageVerificationDialog implements OnInit {
  messageData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    // tslint:Disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private chatDataService: ChatDataService
  ) {
    this.messageData = this.inputData.dataKey;
  }

  ngOnInit(): void {
  }

  deleteMsg(): void {
    this.chatDataService.changeDeletedMessage(this.messageData.messageID);
  }
}
