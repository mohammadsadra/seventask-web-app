import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateTimePickerComponent } from '../../dateTimePicker/date-time-picker.component';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationDTO } from '../../../../DTOs/kanban/EstimationDTO';
import { GeneralTaskDTO } from '../../../../DTOs/kanban/GeneralTaskDTO';
import { CalendarService } from '../../../../services/calendarService/calendar.service';
import { KanbanService } from '../../../../services/kanbanService/kanban.service';
import { TimeService } from '../../../../services/timeService/time.service';
import { TimeDataService } from '../../../../services/timeDataService/time-data-service';
import { DirectionService } from '../../../../services/directionService/direction.service';

@Component({
  selector: 'app-timetrack-header',
  templateUrl: './timetrack-header.component.html',
  styleUrls: ['../SCSS/header-style.scss'],
})
export class TimetrackHeaderComponent implements OnInit {
  allTasks: Array<GeneralTaskDTO>;
  showGetAllTasksLoading = true;
  dirStatus;
  selectedDate = new Date();
  startTime = moment(new Date());
  endTime = moment(new Date());
  taskAddingTimeTrack: number = null;
  textDirection = TextDirectionController.getTextDirection();

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private kanbanService: KanbanService,
    private timeDataService: TimeDataService,
    private directionService: DirectionService,
    private timeService: TimeService
  ) {}

  ngOnInit(): void {
    this.directionService.currentRotation.subscribe(async (deg) => {
      this.dirStatus = localStorage.getItem('languageCode');
    });
    this.timeDataService.currentNewTimeTrack.subscribe((message) => {
      if (message == null) {
        return;
      }
    });
    this.getTasks();
  }

  getTasks() {
    this.kanbanService.getTasks().subscribe((res) => {
      this.showGetAllTasksLoading = false;
      if (res) {
        res.forEach((task) => {
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
        });
        this.allTasks = res.map((x) => Object.assign({}, x));
      }
    });
  }

  openDatePickerDialog() {
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
      this.startTime = moment(res.newDatetime);
      this.endTime = moment(res.newDatetime);
    });
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

  async addTimeTrack() {
    console.log(this.taskAddingTimeTrack);
    if (this.startTime.isSameOrAfter(this.endTime)) {
      this.snackBar.open(
        await this.translateService
          .get('Snackbar.InvalidIntervalTimeTrack')
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
      return;
    }
    this.timeService
      .addTimeTrack(
        this.taskAddingTimeTrack,
        moment.utc(this.startTime.toDate()).format('YYYY-MM-DDTHH:mm:ss'),
        moment.utc(this.endTime.toDate()).format('YYYY-MM-DDTHH:mm:ss')
      )
      .subscribe(
        async (res) => {
          console.log(res.value);
          this.timeDataService.changecurrentNewTimeTrack(res.value);
          this.snackBar.open(
            await this.translateService
              .get('Snackbar.AddTimeTrackSuccessfully')
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
          // console.log(error.error.message);
          if (error.error.message === 'Invalid interval') {
            this.snackBar.open(
              await this.translateService
                .get('Snackbar.InvalidIntervalTimeTrack')
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
          } else if (error.error.message === 'Overlap in timetracks') {
            this.snackBar.open(
              await this.translateService
                .get('Snackbar.overlapTimeTrack')
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
          } else {
            this.snackBar.open(
              await this.translateService
                .get('Snackbar.problemAddTimeTrack')
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
        }
      );
  }
}
