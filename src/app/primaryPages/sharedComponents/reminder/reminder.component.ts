import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { CalendarService } from 'src/app/services/calendarService/calendar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralTaskDTO } from 'src/app/DTOs/kanban/GeneralTaskDTO';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import { AddMemberDialogTypeEnum } from 'src/app/enums/AddMemberDialogTypeEnum';
import { UserDTO } from 'src/app/DTOs/user/UserDTO';
import { DomainName } from 'src/app/utilities/PathTools';
import { ReminderModel } from 'src/app/DTOs/kanban/ReminderModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { TextDirectionController } from 'src/app/utilities/TextDirectionController';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  domainName: string = DomainName;
  currentDateTime = moment(new Date()).set({h: 0, m: 0, s: 0, ms: 0});
  selectedDate = {
    moment: moment(new Date()),
    hour: 0,
    minute: 0,
    meridian: 'AM'
  };
  hours = [
    '1', '2', '3', '4',
    '5', '6', '7', '8',
    '9', '10', '11', '12'
  ];
  minutes = [
    '00', '05', '10', '15',
    '20', '25', '30', '35',
    '40', '45', '50', '55'
  ];
  selectedDatePreset = 'custom';
  datePresets = [
    new Preset('custom', null, null),
    new Preset('today', 0, 'AM'),
    new Preset('tomorrow', 0, 'AM'),
    new Preset('nextWeek', 0, 'AM'),
    new Preset('nextMonth', 0, 'AM'),
  ];
  selectedTask: GeneralTaskDTO;
  linkedUsers: UserDTO[] = [];
  userIds: string[] = [];

  constructor(private calendarService: CalendarService,
              @Inject(MAT_DIALOG_DATA) public inputData: any,
              private _snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<ReminderComponent>,
              private dialog: MatDialog,
              private translateService: TranslateService) { 
                this.selectedTask = inputData.selectedTask;
              }

  ngOnInit(): void {    
    this.selectedDate.minute = this.selectedDate.moment.minute() - this.selectedDate.moment.minute() % 5 + 5;
    this.selectedDate.moment.set({m: this.selectedDate.minute, s: 0, ms: 0});
    this.updateDateTime(this.selectedDate);
  }

  handlePreset(mode: string, preset: Preset) {
    switch (mode) {
      case 'date':
        this.selectedDatePreset = preset.day;
        switch (preset.day) {
          case 'today':
            this.selectedDate.moment = moment(new Date()).set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'tomorrow':
            this.selectedDate.moment = moment(new Date()).add(1, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'nextWeek':
            this.selectedDate.moment = moment(new Date()).add(7, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'nextMonth':
            this.selectedDate.moment = this.calendarService.addAmountToDate(moment(new Date()), 1, 'month').set({h: 0, m: 0, s: 0, ms: 0});
            break;
        }
        this.updateDateTime(this.selectedDate);
        break;
    }
  }

  updateDateTime(date) {
    date.hour = CalendarService.convert24FormatToMeridian(date.moment.hour());
    date.minute = date.moment.minute() - date.moment.minute() % 5;
    date.moment.set({m: date.minute, s: 0, ms: 0});
    date.meridian = date.moment.hour() >= 12 ? 'PM' : 'AM';
  }

  changeDateTime(amount: string, field: string) {
    switch (field) {
      case 'meridian':
        this.selectedDate.moment.set({
          h: this.selectedDate.moment.hour() >= 12 && amount === 'AM' ? this.selectedDate.moment.hour() - 12 :
            (this.selectedDate.moment.hour() < 12 && amount === 'PM' ? this.selectedDate.moment.hour() + 12 : this.selectedDate.moment.hour())
        });
        break;
      case 'hour':
        this.selectedDate.moment.set({
          h: this.selectedDate.meridian === 'PM' ? Number(amount) % 12 + 12 : Number(amount) % 12
        });
        break;
      case 'minute':
        this.selectedDate.moment.set({
          m: Number(amount)
        });
        break;
    }
    this.updateDateTime(this.selectedDate);
  }

  selectedDateHandler($event: any) {
    this.selectedDate.moment.set({y: $event[0].value.getFullYear(), M: $event[0].value.getMonth(), d: $event[0].value.getDate()});
    this.updateDateTime(this.selectedDate);
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToReminder,
        memberList: this.linkedUsers,
        teamId: this.selectedTask.teamId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result[0] !== null) {
        result[0].forEach(member => {
          if (!this.userIds.includes(member.userId)) {            
            this.linkedUsers.push(member);
            this.userIds.push(member.userId);
          }
        });
      }
    });
  }

  removeUser(user: UserDTO) {
    this.linkedUsers.splice(this.linkedUsers.indexOf(user), 1);
    this.userIds.splice(this.userIds.indexOf(user.userId), 1);
  }

  async addReminder() {
    if (this.linkedUsers.length === 0) {
      this._snackBar.open(
        await this.translateService.get('Snackbar.selectAMemberToCreateReminder').toPromise(),
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
    if (this.selectedDate.moment.isBefore(moment(new Date()))) {
      this._snackBar.open(
        await this.translateService.get('Snackbar.reminderTimeShouldBeGreater').toPromise(),
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
    const userIds = this.linkedUsers.map(user => user.userId);
    this.dialogRef.close(new ReminderModel(
      this.selectedTask.id,
      this.selectedDate.moment.toDate(),
      userIds
    ));
  }
}

export class Preset {
  public day: string;
  public time: number;
  public meridiem: string;

  constructor(day: string, time: number, meridiem: string) {
    this.day = day;
    this.time = time;
    this.meridiem = meridiem;
  }
}
