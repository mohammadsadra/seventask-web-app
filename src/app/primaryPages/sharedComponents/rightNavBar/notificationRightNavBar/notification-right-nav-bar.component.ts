import {
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
  Pipe,
  PipeTransform,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {NotificService} from '../../../../services/notificationService/notific.service';
import {DomainName} from '../../../../utilities/PathTools';
import {NotificationDTO} from '../../../../DTOs/notification/NotificationDTO';
import {DataService} from '../../../../services/dataService/data.service';
import {DatePipe} from '@angular/common';
import {JWTTokenService} from '../../../../services/accountService/jwttoken.service';
import {EnglishNumberToArabicNumberPipe} from '../../../../pipes/english-number-to-arabic-number.pipe';
import * as $ from 'jquery';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {FileService} from '../../uploadFile/fileService/file.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {TranslateService} from '@ngx-translate/core';
import {KanbanService} from '../../../../services/kanbanService/kanban.service';
import {TaskCommentPostDTO} from '../../../../DTOs/kanban/TaskCommentPostDTO';
import {DirectionService} from '../../../../services/directionService/direction.service';
import {
  animate,
  query,
  stagger,
  style,
  state,
  transition,
  trigger,
} from '@angular/animations';
import {ResizedEvent} from 'angular-resize-event';
import {SettingsService} from 'src/app/services/settingsService/settings.service';
import {CalendarTypeEnum} from 'src/app/enums/CalendarTypeEnum';

@Component({
  selector: 'app-notification-right-nav-bar',
  templateUrl: './notification-right-nav-bar.component.html',
  styleUrls: ['./notification-right-nav-bar.component.scss'],

  inputs: ['isSelected'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationRightNavBarComponent implements OnInit {
  showGetNotificationsLoading = true;

  notification: Array<NotificationDTO> = [];
  notNotification: boolean;
  domainName: string = DomainName;
  innerHeight: any;
  innerWidth: any;
  Today: string;
  NotificDate: any;
  LastNotificDate: string;
  isSelected = 'activity';
  notificBodyWidth;
  fileTypeWidth;
  userToken;
  lengthCalculate;
  hideShowOlder = false;
  replyMessege = [];
  selectedTask;
  dirStatus;
  showTooltipEx = false;
  tooltipBoxWith: number;
  tooltipTop: number;
  tooltipCurrentLeft: number;
  rightSidebarWidth: number;
  scrollLastNumber = 0;
  scrollCounter = 0;
  scrollRemoteTop = [];
  allNotification: number;
  lazyloadNumber = 30;
  lazyCheckStatus = true;
  lazyPageInShow = 1;
  lazyload = false;
  textDirection = TextDirectionController.getTextDirection();

  checkDisabled = (disLength) => {
    return disLength <
    Math.trunc(
      (this.el.nativeElement.querySelector('.notification-tasks-content')
          .clientWidth *
        33) /
      224
    )
      ? false
      : true;
    // tslint:disable-next-line: semicolon
  };

  constructor(
    private Notificservice: NotificService,
    private dataService: DataService,
    private kanbanService: KanbanService,
    private _snackbar: MatSnackBar,
    private translateService: TranslateService,
    private directionService: DirectionService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 130;
    this.innerWidth = window.innerWidth;
    this.hideShowOlder = false;
    this.notificBodyWidth = this.el.nativeElement.querySelector(
      '.notification-tasks-content'
    ).clientWidth;
    this.fileTypeWidth = Math.trunc((this.notificBodyWidth / 100) * 75 - 56);
    this.lengthCalculate = Math.trunc(((this.innerWidth / 6.1) * 33) / 224);
    this.scrollRemoteTop[0] = 140;
    /* this.Notificservice.getNotification().subscribe((data) => {
      this.notification = data.unSeenNotifs;
    }); */

    this.Notificservice.getNotReceivedNotification().subscribe((data) => {
      const element = this.el.nativeElement.querySelector('.notific-body');
      if (data.unseen.length > 0) {
        this.notNotification = false;
        this.renderer.addClass(element, 'notific-body-animation');
        this.showGetNotificationsLoading = false;
        this.hideShowOlder = false;
      } else {
        this.notNotification = true;
        this.showGetNotificationsLoading = false;
      }
      if (data !== null) {
        if ((this.notification = data.unseen)) {
          this.Notificservice.UpdateMarkAsReceived().subscribe(() => {
            try {
              $('.badge-notif').fadeOut();
              this.renderer.removeClass(element, 'notific-body-animation');
            } catch (err) {
              // console.log(err);
            }
          });
        }
      }
    });
    this.dataService.currentReceiveNotification.subscribe((NotificMsg) => {
      const element = this.el.nativeElement.querySelector('.notific-body');
      if (NotificMsg !== null) {
        this.notification.unshift(NotificMsg);
        this.notNotification = false;
        this.renderer.addClass(element, 'notific-body-animation');
        this.dataService.changeCurrentReceiveNotification(null);
        this.Notificservice.UpdateMarkAsReceived();
      }
    });
    this.directionService.currentRotation.subscribe(async (deg) => {
      this.dirStatus = localStorage.getItem('languageCode');
    });
  }

  onResized(event: ResizedEvent) {
    this.rightSidebarWidth = event.newWidth;
  }

  showOlder() {
    this.lazyload = true;
    /* check number of all notifications */
    this.Notificservice.getNumberOfAll().subscribe((res) => {
      if (res > 0) {
        this.allNotification = Math.ceil(res / this.lazyloadNumber);
        this.showGetNotificationsLoading = true;
        this.notNotification = false;
        this.Notificservice.getAllPageReceived(
          this.lazyloadNumber,
          this.lazyPageInShow
        ).subscribe((result) => {
          if (result !== null) {
            this.notification = result.notifications;
            this.showGetNotificationsLoading = false;
            const element =
              this.el.nativeElement.querySelector('.notific-body');
            this.renderer.addClass(element, 'notific-body-animation');
            this.hideShowOlder = true;
          }
        });
        this.lazyPageInShow++;
      }
    });
    /*  */
  }

  /*  */
  sendWithEnter(event, value, taskID, index) {
    if (!event.shiftKey && event.keyCode === 13) {
      this.addComment(value, taskID, index);
    }
  }

  /* scroll check */

  onContainerScroll(event) {
    let element = this.el.nativeElement.querySelectorAll('.header-notific');
    const lastEl = element.length;
    /* const wrapperHeight = (this.innerHeight - 130) * 0.85; */
    const percent = this.innerHeight > 700 ? 0.6 : 0.8;
    const wrapperHeight = (event.target as Element).scrollHeight * percent;
    const scrollState =
      this.scrollLastNumber - (event.target as Element).scrollTop < 0
        ? '+'
        : '-';
    if (scrollState === '+') {
      if (this.scrollCounter < lastEl - 1) {
        if (
          (event.target as Element).scrollTop <=
          element[this.scrollCounter + 1].offsetTop
        ) {
          this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
          this.renderer.setStyle(
            element[this.scrollCounter],
            'width',
            `${this.rightSidebarWidth}` + 'px'
          );
        } else if (
          (event.target as Element).scrollTop >=
          element[this.scrollCounter + 1].offsetTop
        ) {
          this.renderer.removeClass(
            element[this.scrollCounter],
            'selectedDate'
          );
          if (this.scrollRemoteTop[this.scrollCounter + 1] === undefined) {
            this.scrollRemoteTop.push(
              element[this.scrollCounter + 1].offsetTop
            );
          }
          this.scrollCounter++;
          this.renderer.addClass(element[this.scrollCounter], 'selectedDate');
          this.renderer.setStyle(
            element[this.scrollCounter],
            'width',
            `${this.rightSidebarWidth}` + 'px'
          );
        }
      }
      /* Lazy Load */
      if (this.lazyload) {
        if ((event.target as Element).scrollTop >= wrapperHeight) {
          if (this.allNotification === this.lazyPageInShow) {
            this.lazyCheckStatus = false;
          }
          if (this.lazyCheckStatus) {
            this.showGetNotificationsLoading = true;
            this.lazyCheckStatus = false;
            if (this.allNotification > this.lazyPageInShow) {
              this.lazyPageInShow++;
            }
            /*  */
            this.Notificservice.getAllPageReceived(
              this.lazyloadNumber,
              this.lazyPageInShow
            ).subscribe((result) => {
              result.notifications.forEach((item) => {
                this.notification.push(item);
              });
              this.showGetNotificationsLoading = false;
              this.lazyCheckStatus = true;
              element =
                this.el.nativeElement.querySelectorAll('.header-notific');
            });
            /*  */
          }
        }
      }
      /* Lazy Load */
    } else if (scrollState === '-') {
      /*  */
      if (this.scrollCounter < 1) {
        if ((event.target as Element).scrollTop <= 14) {
          this.renderer.removeClass(element[0], 'selectedDate');
        }
      } else if (
        (event.target as Element).scrollTop <=
        this.scrollRemoteTop[this.scrollCounter] - 20
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
    this.scrollLastNumber = (event.target as Element).scrollTop;
  }

  /*  */

  addComment(value, taskID, index) {
    this.replyMessege[index] = '';
    let comment;
    if (value !== '') {
      comment = value;
    }
    /*--- Add Comment  --- */
    const newComment = new TaskCommentPostDTO(taskID, comment, []);
    this.kanbanService.addComment(newComment).subscribe(
      async (res) => {
        if (res.status === 'Success') {
          this._snackbar.open(
            await this.translateService
              .get('Snackbar.commentsubmittedSuccessfully')
              .toPromise(),
            await this.translateService.get('Buttons.gotIt').toPromise(),
            {
              duration: 2000,
              panelClass: 'snack-bar-container',
              direction:
                TextDirectionController.getTextDirection() === 'ltr'
                  ? 'ltr'
                  : 'rtl',
            }
          );
        }
      },
      async (err) => {
        this._snackbar.open(
          await this.translateService
            .get('Snackbar.problemGettingComments')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            panelClass: 'snack-bar-container',
            direction:
              TextDirectionController.getTextDirection() === 'ltr'
                ? 'ltr'
                : 'rtl',
          }
        );
      }
    );
  }

  /*  */
  checkText(val) {
    const char = new RegExp('[\u0600-\u06FF]');
    if (char.test(val[0]) === true) {
      return `<div style="text-align:start">${val}</div>`;
    } else {
      return `<div>${val}</div>`;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight - 130;
    this.innerWidth = event.target.innerWidth;
    this.notificBodyWidth = this.el.nativeElement.querySelector(
      '.notification-tasks-content'
    ).clientWidth;
    this.lengthCalculate = Math.trunc(((this.innerWidth / 6.1) * 33) / 224);
    this.fileTypeWidth = Math.trunc((this.notificBodyWidth / 100) * 75 - 56);
  }
}

@Pipe({
  name: 'sliceTextForWidth',
})
export class FuncPipeText implements PipeTransform {
  transform(textOnName: any, lenthCalc: number) {
    const maxLength = lenthCalc;
    if (textOnName.length >= maxLength) {
      const strReturn = textOnName.slice(0, maxLength - 5);
      return strReturn + '...';
    } else {
      return textOnName;
    }
  }
}

@Pipe({
  name: 'imgNotificOnName',
})
export class FuncPipeImg implements PipeTransform {
  transform(typeOnName: any, lenthCalc: number) {
    let address;
    if (typeOnName === 1) {
      address = 'seventask-icon-pages-my-teams';
    } else if (typeOnName === 2) {
      address = 'seventask-icon-pages-my-projects';
    } else if (typeOnName === 3) {
      address = 'seventask-icon-pages-my-teams';
    } else if (typeOnName === 4) {
      address = 'seventask-icon-pages-my-tasks';
    }
    return address;
  }
}

@Pipe({
  name: 'ShowIntimeZone',
})
export class FuncPipeTimeZone implements PipeTransform {
  transform(value: any) {
    const timeZone = new Date().getTimezoneOffset() * -1 * 60 * 1000;
    const Time_clac = Date.parse(value) + timeZone;
    const Time_out = new Date(Time_clac);
    return Time_out;
  }
}

@Pipe({
  name: 'checkTime',
})
export class FuncPipeCheckTime implements PipeTransform {
  constructor(
    private datePipe: DatePipe,
    private notificservice: NotificService
  ) {
  }

  transform(date: any, index: number, condition?: number) {
    const NotificDate = this.datePipe.transform(date, 'M/d/yy');
    const result = this.datePipe.transform(NotificDate, 'M/d/yy');
    const conditionCheck = condition === 1 ? true : false;
    if (index === 0) {
      if (!conditionCheck) {
        this.notificservice.setLastNotificDate(date);
      }
      return result;
    } else {
      const last = this.notificservice.getLastNotificDate();
      if (result !== last) {
        if (!conditionCheck) {
          this.notificservice.setLastNotificDate(result);
        }
        return result;
      } else {
        return 0;
      }
    }
  }
}

@Pipe({
  name: 'ReplaceParam',
})
export class FuncPipeReplaceParam implements PipeTransform {
  domainName: string = DomainName;

  constructor(
    private jwtTokenService: JWTTokenService,
    private fileservice: FileService,
    private sanitized: DomSanitizer
  ) {
  }

  transform(str: any, Param: any, parameterTypes?: any, fileWidth?: any) {
    const getUserId = this.jwtTokenService.getUserId();
    for (let i = 0; i < Param.length; i++) {
      const pos = Param[i].indexOf('NickName');
      if (pos !== -1) {
        if (getUserId === this.sliceUserId(Param[i])) {
          str = str.replace('{' + i + '}', '<strong> You </strong>');
        } else {
          const Slicestr = Param[i].slice(pos + 11, Param[i].indexOf(',') - 1);
          str = str.replace('{' + i + '}', '<strong>' + Slicestr + '</strong>');
        }
      } else if (parameterTypes[i] === 5) {
        str = str.replace('{' + i + '}', '');
      } else if (parameterTypes[i] === 4) {
        str = str.replace(
          '{' + i + '}',
          '<div class="inline-color" style = "background-color:#' +
          Param[i] +
          ';" ></div>'
        );
      } else {
        str = str.replace('{' + i + '}', '<strong>' + Param[i] + '</strong>');
      }
    }
    return this.sanitized.bypassSecurityTrustHtml(str);
  }

  sliceUserId(strUserId) {
    const pos = strUserId.indexOf('UserId');
    const firstSlice = strUserId.slice(pos, strUserId.length);
    const camaPos = firstSlice.indexOf(',');
    const resultStr = firstSlice.slice(9, camaPos - 1);
    return resultStr;
  }
}

@Pipe({
  name: 'TimedifferenceCalc',
})
export class FuncPipeTimedifferenceCalc implements PipeTransform {
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();

  constructor(private datePipe: DatePipe) {
  }

  transform(TimeValue: any) {
    const settings = SettingsService.getSettingsFromLocalStorage();
    const selectedCalendar = settings !== null ? settings.firstCalendar : null;
    if (TimeValue === '0' || TimeValue === 0) {
    } else {
      const timeZone = new Date().getTimezoneOffset() * -1 * 60 * 1000;
      const Today = this.datePipe.transform(new Date(), 'M/d/yy');
      const TodayNum = Date.parse(Today) + timeZone;
      const pastNum = Date.parse(TimeValue) + timeZone;
      const faTimeValue = Date.parse(TimeValue);
      const difference = (TodayNum - pastNum) / 1000 / 60 / 60 / 24;
      if (Today === TimeValue) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return 'Today';
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return 'امروز';
        } else {
          return 'Today';
        }
      } else if (difference === 1) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return 'Yesterday';
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return 'دیروز';
        } else {
          return 'Yesterday';
        }
      } else if (difference >= 2 && difference <= 6) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return Math.trunc(difference) + ' days ago';
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference)) + ' روز پیش'
          );
        } else {
          return Math.trunc(difference) + ' days ago';
        }
      } else if (difference >= 7 && difference <= 13) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Last week' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'هفته گذشته' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else {
          return (
            'Last week' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        }
      } else if (difference >= 14 && difference <= 29) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return Math.trunc(difference) + ' days ago';
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            this.toArabicNumPipe.transform(Math.trunc(difference)) + ' روز پیش'
          );
        } else {
          return Math.trunc(difference) + ' days ago';
        }
      } else if (difference >= 30 && difference <= 59) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            'Last month' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            'ماه گذشته' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else {
          return (
            'Last month' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        }
      } else if (difference >= 60 && difference <= 364) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference / 30) +
            ' ' +
            'Month ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            Math.trunc(difference / 30) +
            ' ' +
            'ماه پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else {
          return (
            Math.trunc(difference / 30) +
            ' ' +
            'Month ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        }
      } else if (difference >= 365) {
        if (localStorage.getItem('languageCode') === 'en-US') {
          return (
            Math.trunc(difference / 365) +
            ' ' +
            'Year ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else if (localStorage.getItem('languageCode') === 'fa-IR') {
          return (
            Math.trunc(difference / 365) +
            ' ' +
            'سال پیش' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        } else {
          return (
            Math.trunc(difference / 365) +
            ' ' +
            'Year ago' +
            ' - ' +
            (selectedCalendar === CalendarTypeEnum.GEORGIAN
              ? this.datePipe.transform(TimeValue, 'yyyy/M/d')
              : selectedCalendar === CalendarTypeEnum.JALALI
                ? jmoment(new Date(faTimeValue)).format('jYYYY/jMM/jDD')
                : this.datePipe.transform(TimeValue, 'yyyy/M/d'))
          );
        }
      }
    }
  }
}

/*
@Pipe({
  name: 'ReplaceParam',
})
export class FuncPipeReplaceParam implements PipeTransform {
  transform(value: any, lenthCalc: number) {

  }
}
*/
