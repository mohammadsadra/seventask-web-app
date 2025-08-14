import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import {DomainName} from '../../utilities/PathTools';
import {messageDTO} from '../../DTOs/chat/MessageDTO';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocalStorageService} from '../../services/localStorageService/local-storage.service';
import {ChatService} from '../../services/chatService/chat.service';
import {JWTTokenService} from '../../services/accountService/jwttoken.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {ChatDataService} from '../../services/dataService/chatDataService/chat-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddMember} from '../sharedComponents/header/projectHeader/project-header.component';
import {DataService} from '../../services/dataService/data.service';
import {NotificService} from '../../services/notificationService/notific.service';
import {AccountService} from '../../services/accountService/account.service';
import {FeedbackService} from '../../services/feedbackService/feedback.service';
import {FeedbackDTO} from '../../DTOs/feedback/FeedbackDTO';
import {DatePipe} from '@angular/common';
import {LanguageService} from '../../services/languageService/language.service';
import {WhatIsNewComponent} from '../../pages/whatIsNew/what-is-new.component';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {AppComponent} from '../../app.component';
import {VersionService} from '../../services/versionService/version.service';
import {TranslateService} from '@ngx-translate/core';
import {DirectionService} from '../../services/directionService/direction.service';
import {slideInAnimation, slideInOut} from '../../../animations/animations';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {TaskCommentDTO} from '../../DTOs/kanban/TaskCommentDTO';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {channelDTO} from '../../DTOs/chat/ChannelDTO';
import {SettingsDTO} from '../../DTOs/settings/SettingsDTO';
import {HomeSettingsDTO} from '../../DTOs/home/HomeSettingsDTO';
import {CalendarService} from 'src/app/services/calendarService/calendar.service';
import {KanbanSettingsDTO} from '../../DTOs/kanban/KanbanSettingsDTO';
import {UserClicksDTO} from '../../DTOs/home/UserClicksDTO';
import {CalendarDataService} from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {FirebaseService} from '../../services/firebaseService/firebase.service';
import {ShowMessageInDialogComponent} from '../sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {ButtonTypeEnum} from '../../enums/ButtonTypeEnum';
import {DialogMessageEnum} from '../../enums/DialogMessageEnum';
import {HubCommentResponseModel} from '../../DTOs/hub/HubCommentResponseModel';
import {HubEditTaskResponseModel} from '../../DTOs/hub/HubEditTaskResponseModel';
import {ChecklistItemDTO} from '../../DTOs/kanban/ChecklistItemDTO';
import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-seven-task-home',
  templateUrl: './seven-task-home.component.html',
  styleUrls: ['./seven-task-home.component.scss'],
  animations: [
    slideInOut,
    slideInAnimation,
    trigger('FadeInOut', [
      state(
        'in',
        style({
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          opacity: '1',
        })
      ),
      state(
        'out',
        style({
          backgroundColor: 'none',
          borderRadius: 'none',
          opacity: '0.5',
        })
      ),
      transition('out => in', animate('0.33s ease-in')),
      transition('in => out', animate('0.33s ease-out')),
    ]),
  ],
})
export class SevenTaskHomeComponent implements OnInit, AfterViewInit {
  userClicks: UserClicksDTO;
  clickLimit = 5;
  tooltipShowDelay = 500;
  rGrabber;
  lGrabber;
  // variables for resize ability
  rightNavBarWidth = 350;
  rightNavBarWidthPercantage = 0;
  oldXRightNavBar = 0;
  rightNavBarGrabber = false;

  leftNavBarWidth = 350;
  oldXLeftNavBar = 0;
  leftNavBarGrabber = false;

  panelMaximumWidth = 450;
  panelMinimumWidth = 250;

  isRightNavBarVisible = true;

  inspector = true;
  showTutorial = false;
  innerHeight: any;
  innerWidth: any;
  notificImgUrl = '../../../assets/icons/notification-off.svg';
  chatImgUrl = '../../../assets/icons/chat-inspector-off.svg';
  calendarImgUrl = 'assets/icons/calendar-inspector-off.svg';
  inspectImgUrl = 'assets/icons/info.svg';
  notification = false;
  chat = false;
  calendar = false;
  hubConnection: HubConnection;
  connected;
  domainName: string = DomainName;
  userProfileImageGuid = null;
  userNickName = null;
  numOfNotification = 0;
  bellEffect = false;
  currentVersion;
  numOfUnreadMessage = 0;
  badgeIsShow = false;
  activeChannel: channelDTO;
  activeNotificationTab = '';

  now = new Date();
  disableRightNavBarAnimation = true;

  get currentDate() {
    return this.calendarService.getDateNumber(this.now);
  }

  @HostListener('window:resize', ['$event'])
  resized(event) {
    this.checkBarWidth();
  }

  @HostListener('window:resize', ['$event'])
  checkHeader() {
    const headerContainer = document.getElementById('header-container');
    const headerWidth = headerContainer ? headerContainer.clientWidth : 900;

    if (headerWidth >= 900) {
      this.dataService.makeHeaderSmaller(false);
    } else {
      this.dataService.makeHeaderSmaller(true);
    }
  }

  constructor(
    public router: Router,
    private _formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private localStorageService: LocalStorageService,
    private chatService: ChatService,
    private languageService: LanguageService,
    private jwtTokenService: JWTTokenService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private chatDataService: ChatDataService,
    private dataService: DataService,
    private notificService: NotificService,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private directionService: DirectionService,
    public translate: TranslateService,
    public renderer: Renderer2,
    private versionService: VersionService,
    public translateService: TranslateService,
    public calendarService: CalendarService,
    private calendarDataService: CalendarDataService
  ) {
    // const settingsDTO: SettingsDTO = JSON.parse(localStorage.getItem('settingsData'));
    // localStorage.setItem('settingsData', JSON.stringify(settings));
    if (localStorage.getItem('userClicks')) {
      this.userClicks = JSON.parse(localStorage.getItem('userClicks'));
    } else {
      this.userClicks = new UserClicksDTO(0, 0, 0, 0, 0, 0, 0);
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }

    if (localStorage.getItem('homeSettings') == null) {
      localStorage.setItem(
        'homeSettings',
        JSON.stringify(
          new HomeSettingsDTO(
            this.isRightNavBarVisible,
            this.rightNavBarWidth,
            this.leftNavBarWidth
          )
        )
      );
    } else {
      const homeSettings: HomeSettingsDTO = JSON.parse(
        localStorage.getItem('homeSettings')
      );
      this.leftNavBarWidth = homeSettings.leftPanelWidth;
      this.rightNavBarWidth = homeSettings.rightPanelWidth;
      this.isRightNavBarVisible = homeSettings.isRightPanelVisible;
    }
    if (!this.isRightNavBarVisible) {
      this.inspector = false;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.now = new Date();
      setInterval(() => {
        this.now = new Date();
      }, 60000);
    }, 60000 - (this.now.getSeconds() * 1000 + this.now.getMilliseconds()));

    this.innerHeight = window.innerHeight;

    const showTutorial = this.localStorageService.get('showTutorial');
    showTutorial === 'true'
      ? (this.showTutorial = true)
      : (this.showTutorial = false);

    this.versionService.getLastVersion().subscribe((res) => {
      if (res == null) {
        return;
      }
      this.currentVersion = res.value['id'];
      if (this.showTutorial) {
        localStorage.setItem('currentVersion', this.currentVersion);
        if (localStorage.getItem('languageCode') !== null) {
          this.languageService
            .changeLanguage(localStorage.getItem('languageCode'))
            .subscribe();
        } else {
          localStorage.setItem('languageCode', 'en-US');
          this.translate.use('en');
          this.languageService.changeLanguage('en-US').subscribe();
        }
        TextDirectionController.changeDirection();
        AppComponent.textDirection = TextDirectionController.textDirection;
      } else if (
        this.currentVersion.toString() !==
        localStorage.getItem('currentVersion')
      ) {
        this.openWhatIsNew();
        localStorage.setItem('currentVersion', this.currentVersion);
      }
    });

    this.dataService.currentActiveNotificationTab.subscribe((message) => {
      this.activeNotificationTab = message;
      if (message === 'inspector') {
        this.isRightNavBarVisible = true;
        this.inspector = true;
        this.chat = false;
        this.calendar = false;
        this.notification = false;
        this.inspectImgUrl = 'assets/icons/info.svg';
        this.notificImgUrl = '../../../assets/icons/notification-off.svg';
        this.chatImgUrl = '../../../assets/icons/chat-inspector-off.svg';
        this.calendarImgUrl = 'assets/icons/calendar-inspector-off.svg';
      }
    });

    this.chatService
      .getNumberOfUnreadMessages()
      .subscribe((res) => (this.numOfUnreadMessage = res));

    this.userProfileImageGuid = this.jwtTokenService.getUserProfileImageId();
    this.userNickName = this.jwtTokenService.getUserNickName();

    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return this.localStorageService.get('userToken');
      },
    };

    this.chatDataService.currentSortChannel.subscribe();

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(DomainName + '/chatHub', options)
      .withAutomaticReconnect(this.timeGenerator())
      .build();

    this.startHubConnection();
    this.hubConnection.onclose(err => {
      console.log('hub error');
      console.log(err);
    });
    this.hubConnection.on(
      'ReceiveMessage',
      // tslint:disable-next-line:max-line-length
      (
        messageID,
        body,
        messageTypeId,
        isSentFromMe,
        channelTypeId,
        channelId,
        sentOn,
        senderNickName,
        senderUserId,
        senderImage,
        replyTo,
        isForwarded,
        forwardedFromNickName
      ) => {
        const temp = sentOn.toString().split('.')[0].split('T');
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
        // tslint:Disable-next-line:max-line-length
        const message = new messageDTO(
          messageID,
          body,
          messageTypeId,
          isSentFromMe,
          channelTypeId,
          channelId,
          sentOn,
          senderNickName,
          senderUserId,
          senderImage,
          replyTo,
          false,
          false,
          isForwarded,
          forwardedFromNickName
        );
        this.chatDataService.changeCurrentReceiveMessage(message);
        this.chatDataService.changeSortChannel([channelId, message]);
        this.chatDataService.changeUnSeenMessage(message);
        if (!message.isSentFromMe) {
          if (
            (this.activeChannel != null &&
              this.activeChannel.guid !== message.channelId) ||
            this.activeChannel == null
          ) {
            this.numOfUnreadMessage += 1;
          }
        } else if (
          !message.isSentFromMe &&
          this.activeChannel != null &&
          this.activeChannel.guid === message.channelId
        ) {
          this.hubConnection.send('MarkMessageAsRead', message.messageID);
        }
      }
    );

    this.notificService.getNumberOfNonReceived().subscribe((NotiNum) => {
      this.numOfNotification = NotiNum;
      if (this.numOfNotification > 0) {
        this.badgeIsShow = true;
      }
      if (NotiNum > 0) {
        this.bellEffect = true;
        setTimeout(() => {
          this.bellEffect = false;
        }, 2000);
      }
    });

    this.hubConnection.on('ReceiveNotification', (NotificMsg) => {
      const timeZone = new Date().getTimezoneOffset() * -1 * 60 * 1000;
      const editTime = Date.parse(NotificMsg.notificationTime) - timeZone;
      const Timeresult = new Date(editTime);
      NotificMsg.notificationTime = Timeresult;
      this.dataService.changeCurrentReceiveNotification(NotificMsg);
      this.notificService.getNumberOfNonReceived().subscribe((NotiNum) => {
        if (!this.notification) {
          this.numOfNotification = NotiNum;
          if (this.numOfNotification > 0) {
            this.badgeIsShow = true;
            this.bellEffect = true;
            setTimeout(() => {
              this.bellEffect = false;
            }, 2000);
          }
        }
      });
    });

    this.hubConnection.on('ReceiveNotifReceived', () => {
      this.badgeIsShow = false;
    });

    this.hubConnection.on('ReceiveReadMessage', () => {
      this.chatService
        .getNumberOfUnreadMessages()
        .subscribe((res) => (this.numOfUnreadMessage = res));
    });

    this.hubConnection.on('ReceiveObjectChanged', (obj, objName, isCreated) => {
      // Someone added a comment to a task
      if (objName === 'CommentResponseModel') {
        this.dataService.changeTaskComment(
          new HubCommentResponseModel(obj, isCreated)
        );
      }
      // Someone created a new task
      if (objName === 'TaskResponseModel') {
        if (isCreated) {
          this.dataService.changeTaskCreated(
            obj as GeneralTaskDTO
          );
        } else {
          // this.dataService.changeTaskUpdated(
          //   new HubEditTaskResponseModel(obj, isCreated)
          // );
        }

      }
      if (objName === 'TaskUpdate') {
        this.dataService.changeTaskUpdated(obj);
      }
      if (objName === 'CheckListItemResponseModel') {
        if (isCreated) {
          this.dataService.changeCurrentCheckListItemCreated(
            obj as ChecklistItemDTO
          );
        } else {
          this.dataService.changeCurrentCheckListItemUpdated(
            obj as ChecklistItemDTO
          );
        }
      }
      if (objName === 'TaskAssignees') {
        this.dataService.changeCurrentTaskAssigneesAdded(obj);
      }
      if (objName === 'TaskAttachmentAddition') {
        this.dataService.changeCurrentTaskAttachmentAdded(obj);
      }
      if (objName === 'TaskAttachmentDeletion') {
        this.dataService.changeCurrentTaskAttachmentDeleted(obj);
      }
      if (objName === 'TaskEstimationResponseModel') {
        if (isCreated) {
          this.dataService.changeCurrentTaskEstimationAdded(obj);
        } else {
          this.dataService.changeCurrentTaskEstimationUpdated(obj);
        }
      }
      if (objName === 'TaskUpdateStatus') {
        this.dataService.changeCurrentTaskStatusUpdated(obj);
      }

      console.log(obj);
      console.log(objName);
      console.log(isCreated);
    });

    this.hubConnection.on('ReceiveObjectDeleted', (obj, objName) => {
      if (objName === 'TaskChecklistItem') {
        this.dataService.changeCurrentCheckListItemDeleted(obj);
      }
      if (objName === 'Task') {
        this.dataService.changeTaskDeleted(obj);
      }
      if (objName === 'TaskEstimationResponseModel') {
        this.dataService.changeCurrentTaskEstimationDeleted(obj);
      }
      console.log(obj);
      console.log(objName);
    });

    this.hubConnection.on(
      'ReceivePinMessage',
      (messageId, channelId, channelTypeId) => {
      }
    );
    this.hubConnection.on(
      'ReceiveUnpinMessage',
      (messageId, channelId, channelTypeId) => {
      }
    );

    this.chatDataService.currentActiveChannel.subscribe((activeChannel) => {
      if (activeChannel != null) {
        this.activeChannel = activeChannel;
      } else {
        this.activeChannel = null;
      }
    });

    this.hubConnection.on(
      'ReceiveChangedCulture',
      (newCultureId, newCultureName) => {
        if (
          localStorage.getItem('languageCode').toString() !==
          newCultureId.toString()
        ) {
          // console.log('hi');
          localStorage.setItem('languageCode', newCultureName);
          if (newCultureName === 'en-US') {
            this.translate.use('en');
          } else if (newCultureName === 'fa-IR') {
            this.translate.use('fa');
          }
          TextDirectionController.changeDirection();
          const textDirection = TextDirectionController.getTextDirection();
          this.directionService.changeRotation(
            TextDirectionController.iconRotationDegree
          );
          AppComponent.textDirection = TextDirectionController.textDirection;
          this.dataService.changeDirection(textDirection);
        }
      }
    );

    this.hubConnection.on('ReceiveStopTime', (runTaskStop) => {
      this.dataService.changeStopTime(runTaskStop);
    });

    this.hubConnection.on('ReceiveStartTime', (runTaskStart) => {
      const timeZone = new Date().getTimezoneOffset() * 60 * 1000;
      const fixDate = Date.parse(runTaskStart.timeTrackStartDate) + timeZone;
      runTaskStart.timeTrackStartDate = new Date(fixDate);
      this.dataService.changeStartTime(runTaskStart);
    });

    this.hubConnection.on('ReceivePauseTime', (runTaskPause) => {
      this.dataService.changePausedTime(runTaskPause);
    });

    this.hubConnection.on(
      'ReceiveDeleteMessage',
      (messageID, channelId, channelTypeId) => {
        this.chatDataService.changeDeletedMessage(messageID);
      }
    );

    this.hubConnection.on(
      'ReceiveEditMessage',
      (messageId, channelId, channelTypeId, newBody) => {
        this.chatDataService.changeReceivedEditedMessage([messageId, newBody]);
      }
    );

    this.hubConnection.on(
      'RecieveOnline',
      (userId) => {
        this.chatDataService.changeRecieveOnline([userId, true]);
      }
    );
    this.hubConnection.on(
      'ReceiveIsDisconnected',
      (userId) => {
        this.chatDataService.changeRecieveOnline([userId, false]);
      }
    );

    // IMPORTANT
    // hub for deleting an object.
    this.hubConnection.on(
      'ReceiveObjectDeleted',
      (hubParameter, objectName) => {
        switch (objectName) {
          case 'Event':
            this.calendarDataService.deleteEvent(hubParameter.id);
            break;
        }
      }
    );
    this.chatDataService.currentSendMessage.subscribe((message) => {
      if (message != null) {
        this.hubConnection.send(
          'SendMessage',
          message[0],
          message[1],
          message[2],
          message[3],
          message[4]
        );
      }
    });

    this.chatDataService.currentForwardMessage.subscribe((message) => {
      if (message != null) {
        const tempMessage: messageDTO = message[0];
        const tempChannel: channelDTO = message[1];
        this.hubConnection.send(
          'ForwardMessage',
          tempMessage.messageID,
          tempChannel.channelTypeId,
          tempChannel.guid,
          null
        );
        this.chatDataService.changeCurrentForwardMessage(null);
      }
    });

    this.chatDataService.currentPinMessage.subscribe((message) => {
      if (message != null) {
        this.hubConnection.send('PinMessage', message.messageID);
      }
    });

    this.chatDataService.currentPinMessage.subscribe((message) => {
      if (message != null) {
        // console.log(message.body + '       PIN');
        this.hubConnection.send('PinMessage', message.messageID);
        this.chatDataService.changePinMessage(null);
      }
    });

    this.chatDataService.currentUnPinMessage.subscribe((message) => {
      if (message != null) {
        this.hubConnection.send('UnpinMessage', message.messageID);
        this.chatDataService.changeUnPinMessage(null);
      }
    });

    this.chatDataService.currentSeenMessage.subscribe((messageID) => {
      if (messageID != null) {
        // console.log('seen');
        this.hubConnection.send('MarkMessageAsRead', messageID);
        this.chatDataService.changeSeenMessage(null);
        this.chatService
          .getNumberOfUnreadMessages()
          .subscribe((res) => (this.numOfUnreadMessage = res));
      }
    });

    this.hubConnection.onreconnecting(() => {
      this.connected = false;
    });

    this.hubConnection.onreconnected(() => {
      this.connected = true;
    });

    this.chatDataService.currentDeletedMessage.subscribe((messageID) => {
      if (messageID !== null) {
        this.hubConnection.send('DeleteMessage', messageID);
        this.chatDataService.changeDeletedMessage(null);
      }
    });

    this.chatDataService.currentEditedMessage.subscribe((editedMessage) => {
      if (editedMessage !== null) {
        // console.log(editedMessage);
        this.hubConnection.send(
          'EditMessage',
          editedMessage[0],
          editedMessage[1]
        );
        this.chatDataService.changeEditedMessage(null);
        // console.log('edit');
      }
    });
  }

  ngAfterViewInit() {
    this.checkBarWidth();
    this.checkHeader();
    this.rGrabber = document.getElementById('rightNavBarGrabber');
    document.addEventListener('mousemove', (event) => {
      if (this.rightNavBarGrabber) {
        let newValue = event.clientX - this.oldXRightNavBar;
        newValue *= TextDirectionController.getTextDirection() === 'ltr' ? 1 : -1;
        this.resizerRightNavBar(newValue);
        this.oldXRightNavBar = event.clientX;
      }
      if (this.leftNavBarGrabber) {
        let newValue = event.clientX - this.oldXLeftNavBar;
        newValue *= TextDirectionController.getTextDirection() === 'ltr' ? 1 : -1;
        this.resizerLeftNavBar(newValue);
        this.oldXLeftNavBar = event.clientX;
      }
    });

    this.rGrabber?.addEventListener('mousedown', (event) => {
      this.rightNavBarGrabber = true;
      this.oldXRightNavBar = event.clientX;
    });

    document.addEventListener('mouseup', (e) => {
      this.rightNavBarGrabber = false;
    });

    this.lGrabber = document.getElementById('leftNavBarGrabber');
    this.lGrabber?.addEventListener('mousedown', (event) => {
      this.leftNavBarGrabber = true;
      this.oldXLeftNavBar = event.clientX;
    });

    document.addEventListener('mouseup', (e) => {
      this.leftNavBarGrabber = false;
    });
  }

  checkBarWidth() {
    const pageHeaderWidth = document.getElementById('page-header').offsetWidth;
    this.panelMaximumWidth = 0.3 * pageHeaderWidth;
    this.panelMinimumWidth = 0.2 * pageHeaderWidth;
    this.resizerRightNavBar(0);
    this.resizerLeftNavBar(0);
  }

  resizerRightNavBar(offsetX: number) {
    // console.log(offsetX);
    // console.log('width before:' + this.rightNavBarWidth);
    this.rightNavBarWidth -= offsetX;
    if (this.rightNavBarWidth > this.panelMaximumWidth) {
      this.rightNavBarWidth = this.panelMaximumWidth;
    }
    if (this.rightNavBarWidth < this.panelMinimumWidth) {
      this.rightNavBarWidth = this.panelMinimumWidth;
    }
    this.checkHeader();
    this.rightNavBarWidthPercantage =
      (this.rightNavBarWidth /
        document.getElementById('page-header').offsetWidth) *
      100;
    localStorage.setItem(
      'homeSettings',
      JSON.stringify(
        new HomeSettingsDTO(
          this.isRightNavBarVisible,
          this.rightNavBarWidth,
          this.leftNavBarWidth
        )
      )
    );
  }

  resizerLeftNavBar(offsetX: number) {
    this.leftNavBarWidth += offsetX;
    if (this.leftNavBarWidth > this.panelMaximumWidth) {
      this.leftNavBarWidth = this.panelMaximumWidth;
    }
    if (this.leftNavBarWidth < this.panelMinimumWidth) {
      this.leftNavBarWidth = this.panelMinimumWidth;
    }
    this.checkHeader();
    localStorage.setItem(
      'homeSettings',
      JSON.stringify(
        new HomeSettingsDTO(
          this.isRightNavBarVisible,
          this.rightNavBarWidth,
          this.leftNavBarWidth
        )
      )
    );
  }

  changeUserClicks(inp: string) {
    amplitude.track('left_toolbar_' + inp + '_click');
    if (inp === 'dashboard') {
      this.userClicks.dashboard = this.userClicks.dashboard + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'todo') {
      this.userClicks.todo = this.userClicks.todo + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'project') {
      this.userClicks.project = this.userClicks.project + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'team') {
      this.userClicks.team = this.userClicks.team + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'calendar') {
      this.userClicks.calendar = this.userClicks.calendar + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'chat') {
      this.userClicks.chat = this.userClicks.chat + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
    if (inp === 'more') {
      this.userClicks.more = this.userClicks.more + 1;
      localStorage.setItem('userClicks', JSON.stringify(this.userClicks));
    }
  }

  calculateTooltipShowDelay(inp: string): number {
    if (inp === 'dashboard') {
      this.userClicks.dashboard <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.dashboard > 5 && this.userClicks.dashboard <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.dashboard > 10 && this.userClicks.dashboard <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'todo') {
      this.userClicks.todo <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.todo > 5 && this.userClicks.todo <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.todo > 10 && this.userClicks.todo <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'project') {
      this.userClicks.project <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.project > 5 && this.userClicks.project <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.project > 10 && this.userClicks.project <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'team') {
      this.userClicks.team <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.team > 5 && this.userClicks.team <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.team > 10 && this.userClicks.team <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'calendar') {
      this.userClicks.calendar <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.calendar > 5 && this.userClicks.calendar <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.calendar > 10 && this.userClicks.calendar <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'chat') {
      this.userClicks.chat <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.chat > 5 && this.userClicks.chat <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.chat > 10 && this.userClicks.chat <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    if (inp === 'more') {
      this.userClicks.more <= 5
        ? (this.tooltipShowDelay = 100)
        : this.userClicks.more > 5 && this.userClicks.more <= 10
          ? (this.tooltipShowDelay = 1000)
          : this.userClicks.more > 10 && this.userClicks.more <= 20
            ? (this.tooltipShowDelay = 2000)
            : (this.tooltipShowDelay = 5000);
    }
    return this.tooltipShowDelay;
  }

  async startHubConnection() {
    try {
      await this.hubConnection.start();
      this.connected = true;
    } catch (err) {
      this.connected = false;
      setTimeout(() => this.startHubConnection(), 5000);
    }
  }

  timeGenerator(): Array<number> {
    const arr = [1];
    for (let i = 0; i < 10; i++) {
      arr.push(i * 500);
    }
    for (let i = 0; i < 20; i++) {
      arr.push(i * 1000);
    }
    for (let i = 0; i < 120000; i++) {
      arr.push(i * 5000);
    }
    for (let i = 0; i < 120000; i++) {
      arr.push(i * 10000);
    }
    return arr;
  }

  openWhatIsNew(): void {
    const dialogRef = this.dialog.open(WhatIsNewComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  skipTutorial() {
    this.showTutorial = false;
    this.localStorageService.set('showTutorial', 'false');
  }

  TabSelect(selTab) {
    this.disableRightNavBarAnimation = false;
    setTimeout(() => {
      if (selTab === 1) {
        if (this.inspector) {
          this.isRightNavBarVisible = false;
          this.inspector = false;
        } else {
          this.inspector = true;
          if (!this.isRightNavBarVisible) {
            this.isRightNavBarVisible = true;
          }
        }
        this.chat = false;
        this.calendar = false;
        this.notification = false;
        this.inspectImgUrl = 'assets/icons/info.svg';
        this.notificImgUrl = '../../../assets/icons/notification-off.svg';
        this.chatImgUrl = '../../../assets/icons/chat-inspector-off.svg';
        this.calendarImgUrl = 'assets/icons/calendar-inspector-off.svg';
        setTimeout(() => {
          this.disableRightNavBarAnimation = true;
        }, 1);
      } else if (selTab === 2) {
        if (this.chat) {
          this.isRightNavBarVisible = false;
          this.chat = false;
        } else {
          this.chat = true;
          if (!this.isRightNavBarVisible) {
            this.isRightNavBarVisible = true;
          }
        }
        this.inspector = false;
        this.notification = false;
        this.calendar = false;
        this.notificImgUrl = '../../../assets/icons/notification-off.svg';
        this.inspectImgUrl = 'assets/icons/info-off.svg';
        this.chatImgUrl = '../../../assets/icons/chat-inspector-on.svg';
        this.calendarImgUrl = 'assets/icons/calendar-inspector-off.svg';
        setTimeout(() => {
          this.disableRightNavBarAnimation = true;
        }, 1);
      } else if (selTab === 3) {
        if (this.calendar) {
          this.isRightNavBarVisible = false;
          this.calendar = false;
        } else {
          this.calendar = true;
          if (!this.isRightNavBarVisible) {
            this.isRightNavBarVisible = true;
          }
        }
        this.inspector = false;
        this.notification = false;
        this.chat = false;
        this.notificImgUrl = '../../../assets/icons/notification-off.svg';
        this.inspectImgUrl = 'assets/icons/info-off.svg';
        this.chatImgUrl = '../../../assets/icons/chat-inspector-off.svg';
        this.calendarImgUrl = 'assets/icons/calendar-inspector-on.svg';
        setTimeout(() => {
          console.log(this.disableRightNavBarAnimation);

          this.disableRightNavBarAnimation = true;
          console.log(this.disableRightNavBarAnimation);
        }, 1);
      } else if (selTab === 4) {
        if (this.notification) {
          // Notification.requestPermission().then((permission) => {
          //   console.log(permission);
          // });
          this.isRightNavBarVisible = false;
          this.notification = false;
        } else {
          this.notification = true;
          // Notification.requestPermission().then((permission) => {
          //   console.log(permission);
          // });
          // console.log('hi notif');
          // this.firebaseService.requestPermission();
          if (!this.isRightNavBarVisible) {
            this.isRightNavBarVisible = true;
          }
        }
        this.inspector = false;
        this.chat = false;
        this.calendar = false;
        this.badgeIsShow = false;
        this.notificImgUrl = '../../../assets/icons/notification.svg';
        this.inspectImgUrl = 'assets/icons/info-off.svg';
        this.chatImgUrl = '../../../assets/icons/chat-inspector-off.svg';
        this.calendarImgUrl = 'assets/icons/calendar-inspector-off.svg';
        setTimeout(() => {
          this.disableRightNavBarAnimation = true;
        }, 1);
      }
      localStorage.setItem(
        'homeSettings',
        JSON.stringify(
          new HomeSettingsDTO(
            this.isRightNavBarVisible,
            this.rightNavBarWidth,
            this.leftNavBarWidth
          )
        )
      );
    }, 1);
  }

  textDirection() {
    return TextDirectionController.getTextDirection();
  }

  openSignOutDialog() {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.signOut, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.signOut,
        // itemName: 'task.title',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.signOut) {
          this.signOut();
        }
      }
    });
  }

  async signOut() {
    this.router.navigate(['/signIn']);
    this.accountService.signOut(localStorage.getItem('refreshToken')).subscribe(
      async (res) => {
        await this.hubConnection.stop();
        this.localStorageService.remove('userToken');
        this.localStorageService.remove('refreshToken');
        this.localStorageService.remove('settingsData');
        // this.router.navigate(['/signIn']);
        // this._snackBar.open(
        //   await this.translateService.get('Snackbar.signedOut').toPromise(),
        //   await this.translateService.get('Buttons.gotIt').toPromise(),
        //   {
        //     duration: 2000,
        //     panelClass: 'snack-bar-container',
        //     direction:
        //       TextDirectionController.getTextDirection() === 'ltr'
        //         ? 'ltr'
        //         : 'rtl',
        //   }
        // );
      },
      async (err) => {
        // this._snackBar.open(
        //   await this.translateService.get('Snackbar.cantSignOut').toPromise(),
        //   await this.translateService.get('Buttons.gotIt').toPromise(),
        //   {
        //     duration: 2000,
        //     panelClass: 'snack-bar-container',
        //     direction:
        //       TextDirectionController.getTextDirection() === 'ltr'
        //         ? 'ltr'
        //         : 'rtl',
        //   }
        // );
      }
    );
  }

  // @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight;
  }

  sendMessage(message) {
    this.hubConnection.send(
      'SendMessage',
      message[0],
      message[1],
      message[2],
      message[3],
      message[4]
    );
  }

  openReportBug(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(ReportBug, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
    );
  }

  changeLanguage(languageCode: string) {
    this.localStorageService.set('languageCode', languageCode);
    if (localStorage.getItem('userToken') === null) {
      // location.reload();
      // window.location.replace('/' + languageCode + this.router.url);
    } else {
      this.languageService.changeLanguage(languageCode).subscribe((res) => {
        // window.location.replace('/' + languageCode + this.router.url);
        // location.reload();
      });
    }
    TextDirectionController.changeDirection();
    this.directionService.changeRotation(
      TextDirectionController.iconRotationDegree
    );
    AppComponent.textDirection = TextDirectionController.textDirection;
    // console.log('td2:' + TextDirectionController.textDirection);
    // this.renderer.setAttribute(document.getElementsByTagName('body'), 'dir', TextDirectionController.textDirection);
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-bug',
  templateUrl: 'reportBug/report-bug.html',
  styleUrls: ['./reportBug/report-bug-style.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ReportBug implements OnInit {
  feedback: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    // tslint:Disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private feedbackService: FeedbackService,
    public dialogRef: MatDialogRef<AddMember>,
    private _formBuilder: FormBuilder,
    public translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.feedback = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: [],
    });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      direction:
        TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
    });
  }

  createFeedback() {
    this.feedbackService
      .creatFeedback(
        new FeedbackDTO(
          this.feedback.controls.title.value,
          this.feedback.controls.description.value,
          null
        )
      )
      .subscribe(async (res) => {
        this.openSnackBar(
          await this.translateService.get('Snackbar.weWillCheck').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise()
        );
      });
  }
}
