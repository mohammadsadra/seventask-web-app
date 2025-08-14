import { Component, OnInit, HostListener } from '@angular/core';
import { TimeTrackService } from './../../../services/timeTrackService/time-track.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonTypeEnum } from '../../../enums/ButtonTypeEnum';
import { DialogMessageEnum } from '../../../enums/DialogMessageEnum';
import { ShowMessageInDialogComponent } from '../../../primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import { interval } from 'rxjs';
import { DatePipe, Time } from '@angular/common';
import { TimeTrackDTO } from './../../../DTOs/timeTrack/TimeTrackDTO';
import { TimeDataService } from '../../../services/timeDataService/time-data-service';
import { DateTimePickerComponent } from '../../../primaryPages/sharedComponents/dateTimePicker/date-time-picker.component';
import * as moment from 'moment';
import { CalendarService } from '../../../services/calendarService/calendar.service';
import { KanbanService } from '../../../services/kanbanService/kanban.service';
import { GeneralTaskDTO } from '../../../DTOs/kanban/GeneralTaskDTO';
import { ChecklistItemPostDTO } from '../../../DTOs/kanban/ChecklistItemPostDTO';
import { TextDirectionController } from '../../../utilities/TextDirectionController';
import { TimeService } from '../../../services/timeService/time.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DirectionService } from '../../../services/directionService/direction.service';

@Component({
  selector: 'app-timetrack',
  templateUrl: './timetrack.component.html',
  styleUrls: ['./timetrack.component.scss'],
})
export class TimetrackComponent implements OnInit {
  selectedTimeTrack: TimeTrackDTO;
  timeTracks: Array<TimeTrackDTO> = [];
  showGetTimeTrackLoading: boolean;
  timerShow = 0;
  totalTracks: Array<any> = [];

  isEditingTimeTrack: boolean[] = [];

  selectedDate: Date = null;
  startTime = null;
  endTime = null;
  taskAddingTimeTrack;
  dirStatus;
  allTasks: GeneralTaskDTO[] = [];
  showGetAllTasksLoading = true;
  innerHeight: any;
  textDirection = TextDirectionController.getTextDirection();

  constructor(
    private timeTrackService: TimeTrackService,
    private datePipe: DatePipe,
    private timeDataService: TimeDataService,
    private kanbanService: KanbanService,
    private timeService: TimeService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public translateService: TranslateService,
    private directionService: DirectionService
  ) {}

  ngOnInit() {
    interval(1000).subscribe(() => {
      this.timerShow++;
    });

    this.timeTracks = null;
    this.innerHeight = window.innerHeight - 80;
    this.showGetTimeTrackLoading = true;
    this.timeTrackService.setCounter(0);
    /* direction */
    this.directionService.currentRotation.subscribe(async (deg) => {
      this.dirStatus = localStorage.getItem('languageCode');
    });
    /*  */

    this.timeTrackService.getTimeTracks().subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        this.isEditingTimeTrack[i] = false;
      }
      this.showGetTimeTrackLoading = false;
      this.timeTracks = result;
      this.timeTracks.forEach((timeTrack) => {
        timeTrack.startDate = new Date(
          CalendarService.convertUtcToLocalTime(
            timeTrack.startDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );
        timeTrack.endDate = new Date(
          CalendarService.convertUtcToLocalTime(
            timeTrack.endDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );
      });

      if (result !== null) {
        this.createTotalTime(this.timeTracks);
      }
    });
    /* Add new Time Track */
    this.timeDataService.currentNewTimeTrack.subscribe((res) => {
      if (res !== null && this.timeTracks.length > 0) {
        res.startDate = new Date(
          CalendarService.convertUtcToLocalTime(
            res.startDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );
        res.endDate = new Date(
          CalendarService.convertUtcToLocalTime(
            res.endDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );

        /*  */
        this.findIndex(res, this.timeTracks);
      } else if (res !== null && this.timeTracks.length === 0) {
        res.startDate = new Date(
          CalendarService.convertUtcToLocalTime(
            res.startDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );
        res.endDate = new Date(
          CalendarService.convertUtcToLocalTime(
            res.endDate,
            'YYYY-MM-DDTHH:mm:ss'
          )
        );

        this.timeTracks.push(res);
        this.timeTrackService.setCounter(0);
        this.createTotalTime(this.timeTracks);
      }
    });
    this.getTasks();

    /*  */
  }

  getTasks() {
    this.kanbanService.getTasks().subscribe((res) => {
      this.showGetAllTasksLoading = false;
      if (res) {
        for (let task of res) {
          if (task.startDate) {
            task.startDate = new Date(
              CalendarService.convertUtcToLocalTime(
                task.startDate,
                'YYYY-MM-DDTHH:mm:ss'
              )
            );
          }
          if (task.endDate) {
            task.endDate = new Date(
              CalendarService.convertUtcToLocalTime(
                task.endDate,
                'YYYY-MM-DDTHH:mm:ss'
              )
            );
          }
          task.modifiedOn = new Date(
            CalendarService.convertUtcToLocalTime(
              task.modifiedOn,
              'YYYY-MM-DDTHH:mm:ss'
            )
          );
        }
        this.allTasks = res.map((x) => Object.assign({}, x));
      }
    });
  }

  /* delete Dialog */
  deleteTimeTrackDialog(timeTrack) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteTimeTrack,
        itemName: timeTrack.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.timeTrackDelete(timeTrack);
        this.timeTrackService.setCounter(0);
      }
    });
  }

  /* delete */
  timeTrackDelete(item) {
    this.timeTrackService.deleteTimeTrack(item.id).subscribe((res) => {
      if (res.status === 'Success') {
        const itemIndex = this.timeTracks.findIndex((t) => t.id === item.id);
        if (itemIndex > 0) {
          this.timeTrackService.setLastRepeatDate(
            this.datePipe.transform(
              this.timeTracks[itemIndex - 1].startDate,
              'M/d/yy'
            )
          );
        } else {
          this.timeTrackService.setLastRepeatDate(
            this.datePipe.transform(
              this.timeTracks[itemIndex].startDate,
              'M/d/yy'
            )
          );
        }

        this.timeTracks.splice(itemIndex, 1);
        /* this.timeTracks = this.timeTracks.filter((t) => t.id !== item.id); */

        this.createTotalTime(this.timeTracks);
      }
    });
  }

  /* edit */
  editTimeTrack(editingTimeTrack: TimeTrackDTO, index) {
    const task = this.taskAddingTimeTrack
      ? this.taskAddingTimeTrack
      : editingTimeTrack.generalTask.id;

    this.timeService
      .editTimeTrack(
        editingTimeTrack.id,
        task,
        moment.utc(this.startTime).format('YYYY-MM-DDTHH:mm:ss'),
        moment.utc(this.endTime).format('YYYY-MM-DDTHH:mm:ss')
      )
      .subscribe(
        async (res) => {
          editingTimeTrack.startDate = this.startTime;
          editingTimeTrack.endDate = this.endTime;
          const diff = moment(this.endTime).diff(this.startTime);
          editingTimeTrack.totalTimeInMinutes = diff / 1000 / 60;
          editingTimeTrack.generalTask = this.taskAddingTimeTrack
            ? this.allTasks.find((t) => t.id === this.taskAddingTimeTrack)
            : editingTimeTrack.generalTask;
          this.createTotalTime(this.timeTracks);
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.taskChecklistItemAdded')
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
        },
        async (error) => {
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.editTimeTrackError')
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
    this.isEditingTimeTrack[index] = false;
  }

  /*  */
  totalTracker(date: Date, index: number, minute: number, lastIndex: number) {
    const result = this.datePipe.transform(date, 'M/d/yy');
    let pastMinute;
    if (minute === null) {
      const todadTZ = new Date(
        CalendarService.convertUtcToLocalTime(new Date(), 'YYYY-MM-DDTHH:mm:ss')
      );
      const today = this.datePipe.transform(todadTZ, 'M/d/yy, h:mm:ss a');
      const TimeValue = this.datePipe.transform(date, 'M/d/yy, h:mm:ss a');

      const TodayNum = Date.parse(today);
      const pastNum = Date.parse(TimeValue);
      const difference = (TodayNum - pastNum) / 1000 / 60;
      pastMinute = difference;
    } else {
      pastMinute = minute;
    }
    const getTotal = this.timeTrackService.getTotal();

    if (index === 0) {
      if (index === lastIndex - 1) {
        this.totalTracks.push(pastMinute);
      } else {
        this.timeTrackService.setLastDate(result);
        this.timeTrackService.setTotal(pastMinute);
      }
    } else {
      const last = this.timeTrackService.getLastDate();

      if (result !== last) {
        this.timeTrackService.setLastDate(result);
        this.totalTracks.push(getTotal);
        this.timeTrackService.setTotal(pastMinute);
        if (index === lastIndex - 1) {
          this.totalTracks.push(pastMinute);
          this.timeTrackService.setLastDate(null);
        }
      } else if (result === last) {
        if (index === lastIndex - 1) {
          this.totalTracks.push(getTotal + pastMinute);
          this.timeTrackService.setLastDate(null);
        } else {
          this.timeTrackService.setTotal(pastMinute + getTotal);
        }
      }
    }
  }

  /*  */
  createTotalTime(arr) {
    this.totalTracks = [];
    arr.forEach((item, index) => {
      this.totalTracker(
        item.startDate,
        index,
        item.totalTimeInMinutes,
        arr.length
      );
    });
  }

  /*  */
  findIndex(res, target) {
    const val = res.startDate;
    const value = Date.parse(val);
    let i;
    let condition = true;
    for (let index = 0; condition; index++) {
      i = index;
      const trVal = target[index].startDate;
      const targetVal = Date.parse(trVal);
      if (targetVal <= value) {
        condition = false;
      } else if (index >= target.length - 1) {
        i++;
        condition = false;
      }
    }

    this.timeTracks.splice(i, 0, res);
    const targetDate = i > 0 ? target[i - 1].startDate : target[i].startDate;
    this.timeTrackService.setLastRepeatDate(
      this.datePipe.transform(targetDate, 'M/d/yy')
    );
    this.timeTrackService.setCounter(0);
    this.createTotalTime(this.timeTracks);
  }

  selectTimeTrack(timeTrack: TimeTrackDTO) {
    this.selectedTimeTrack = timeTrack;
  }

  editTimeTrackClick(timeTrack, index) {
    this.isEditingTimeTrack.fill(false);
    this.isEditingTimeTrack[index] = true;
    this.selectedDate = timeTrack.startDate;
    this.startTime = moment(timeTrack.startDate);
    this.endTime = moment(timeTrack.endDate);
  }

  changeHourEdit(event, startOrEnd: boolean) {
    if (startOrEnd) {
      this.startTime.set({ h: event.target.value });
    } else {
      this.endTime.set({ h: event.target.value });
    }
  }

  changeMinuteEdit(event, startOrEnd: boolean) {
    if (startOrEnd) {
      this.startTime.set({ m: event.target.value });
    } else {
      this.endTime.set({ m: event.target.value });
    }
  }

  openDatePickerDialog(index, startDate) {
    // this.selectedDate = startDate;
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        dateTime: this.selectedDate,
        dateOnly: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }

      this.selectedDate = res.newDatetime;
      // this.startTime = moment(res.newDatetime);
      // this.endTime = moment(res.newDatetime);
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight - 80;
  }
}
