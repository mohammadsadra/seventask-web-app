import {Component, HostListener, OnInit} from '@angular/core';
import {DomainName} from '../../../../../utilities/PathTools';
import {GeneralTaskDTO} from '../../../../../DTOs/kanban/GeneralTaskDTO';
import {MainWithInspectorService} from '../../../../../services/mainWithInspectorService/main-with-inspector.service';
import {DirectionService} from '../../../../../services/directionService/direction.service';
import {TaskCommentDTO} from '../../../../../DTOs/kanban/TaskCommentDTO';
import {KanbanService} from '../../../../../services/kanbanService/kanban.service';
import {CalendarService} from '../../../../../services/calendarService/calendar.service';
import {TextDirectionController} from '../../../../../utilities/TextDirectionController';
import {ActivityLogDTO} from '../../../../../DTOs/kanban/ActivityLogDTO';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {HistoryDTO} from '../../../../../DTOs/history/HistoryDTO';
import {ParameterDTO} from '../../../../../DTOs/history/ParameterDTO';
import {ColorsEnum} from '../../../../../enums/ColorsEnum';
import {JWTTokenService} from '../../../../../services/accountService/jwttoken.service';
import {DomSanitizer} from '@angular/platform-browser';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  animations: [
    trigger('inspectorAnimation', [
      state('in', style({opacity: 1})),
      state('out', style({opacity: 0})),
      transition('* => in', [animate('150ms linear')]),
      transition('* => out', [animate('150ms linear')]),
    ]),
  ],
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit {
  inspectorAnimationOn = true;
  domainName = DomainName;
  columnHeight;
  selectedTask: GeneralTaskDTO;
  showGetTaskHistoryLoading = true;
  iconRotationDegree = 0;
  selectedTaskActivityLogs: ActivityLogDTO[];
  userId: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.columnHeight = event.target.innerHeight;
  }

  constructor(
    private mainWithInspectorService: MainWithInspectorService,
    private directionService: DirectionService,
    private kanbanService: KanbanService,
    private _snackbar: MatSnackBar,
    private translateService: TranslateService,
    private jwtTokenService: JWTTokenService
  ) {
    this.userId = jwtTokenService.getUserId();
  }

  ngOnInit(): void {
    this.columnHeight = window.innerHeight;

    this.mainWithInspectorService.currenttask.subscribe((message) => {
      if (message == null) {
        this.selectedTask = null;
        return;
      }
      if (this.selectedTask != null && message.id !== this.selectedTask.id) {
        this.selectedTaskActivityLogs = [];
        setTimeout(() => {
          this.inspectorAnimationOn = false;

        }, 100);
        this.selectedTask = message;
        setTimeout(() => {

          this.inspectorAnimationOn = true;
        }, 100);
        this.inspectorAnimationOn = false;
      } else {
        this.selectedTask = message;
      }

      this.showGetTaskHistoryLoading = true;
      // this.selectedTask = message;
      this.getTaskHistory(message);
    });

    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
    });
  }

  // checkFlag() {
  //   if (flag === false) {
  //     window.setTimeout(this.checkFlag, 100); /* this checks the flag every 100 milliseconds*/
  //   } else {
  //     /* do something*/
  //   }
  // }


  private getTaskHistory(m?: GeneralTaskDTO) {
    if (this.selectedTask == null) {
      return;
    }
    this.kanbanService.getTaskHistory(m != null ? m.id : this.selectedTask.id).subscribe(
      async (res) => {
        this.showGetTaskHistoryLoading = false;
        this.selectedTaskActivityLogs = res.value;
        for (const activityLog of this.selectedTaskActivityLogs) {
          activityLog.time = new Date(
            CalendarService.convertUtcToLocalTime(
              activityLog.time,
              'YYYY-MM-DDTHH:mm:ss'
            )
          );
          activityLog.message = await this.stringFormat(
            activityLog.message,
            activityLog.parameters
          );
        }
        // console.log(this.selectedTaskActivityLogs);
      },
      async (err) => {
        this._snackbar.open(
          await this.translateService
            .get('Snackbar.problemGettingActivityLog')
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

  private async stringFormat(
    message: string,
    parameterList: Array<ParameterDTO>
  ) {
    for (let i = 0; i < parameterList.length; i++) {
      if (parameterList[i].parameterType === 1) {
        message = message.replace(
          '{' + i + '}',
          '<strong>' + parameterList[i].parameterBody + '</strong>'
        );
      } else if (parameterList[i].parameterType === 2) {
        const position = parameterList[i].parameterBody.indexOf('NickName');
        const positionUserID = parameterList[i].parameterBody.indexOf(
          this.userId
        );
        let user = parameterList[i].parameterBody.slice(
          position + 11,
          parameterList[i].parameterBody.indexOf(',') - 1
        );
        if (positionUserID !== -1) {
          user = await this.translateService.get('Team.you').toPromise();
        }
        message = message.replace(
          '{' + i + '}',
          '<strong>' + user + '</strong>'
        );
        // message = message.replace('{' + i + '}', '<strong>' + parameterList[i].parameterBody.split('\"')[3] + '</strong>');
      } else if (parameterList[i].parameterType === 5) {
        message = message.replace(
          '{' + i + '}',
          ''
        );
        // message = message.replace('{' + i + '}', '<app-show-file [data]="parameterList[i].parameterBody"> </app-show-file>');
      }
    }
    return message;
  }

  SliceImgString(str: Array<ParameterDTO>) {
    for (let i = 0; i < str.length; i++) {
      const pos = str[i].parameterBody.lastIndexOf('ProfileImageGuid');
      if (pos !== -1) {
        const str1 = str[i].parameterBody.slice(
          pos,
          str[i].parameterBody.length
        );
        const str2 = str1.slice(str1.indexOf(':') + 1, str1.length - 1);
        if (str2 === 'null') {
          return null;
        } else {
          const returnStr = str1.slice(str1.indexOf(':') + 2, str1.length - 2);
          return (
            this.domainName + '/en-US/file/get?id=' + returnStr + '&quality=100'
          );
        }
      }
    }
  }
}
