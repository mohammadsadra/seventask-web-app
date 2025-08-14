import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CalendarApiService} from '../../../services/calendarService/calendarAPI/calendar-api.service';
import {EventModel} from '../../../DTOs/calendar/EventModel';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {TeamService} from '../../../services/teamSerivce/team.service';
import {TeamDTO} from '../../../DTOs/team/Team.DTO';
import {TextDirectionController} from '../../../utilities/TextDirectionController';
import {FileService} from '../../sharedComponents/uploadFile/fileService/file.service';
import {FileDTO} from '../../../DTOs/file/FileDTO';
import {UploadResponseModel} from '../../../DTOs/responseModel/UploadResponseModel';
import * as $ from 'jquery';
import {ProjectService} from '../../../services/projectService/project.service';
import {ProjectDTO} from '../../../DTOs/project/Project';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import { fadeInOutAnimation } from 'src/animations/animations';
import { AddMemberDialogComponent } from '../../sharedComponents/add-member-dialog/add-member-dialog.component';
import { AddMemberDialogTypeEnum } from 'src/app/enums/AddMemberDialogTypeEnum';
import { DomainName } from 'src/app/utilities/PathTools';
import { UserDTO } from 'src/app/DTOs/user/UserDTO';
import { CalendarDataService } from 'src/app/services/dataService/calendarDataService/calendar-data.service';

@Component({
  selector: 'app-calendar-new-event',
  templateUrl: './calendar-new-event.component.html',
  styleUrls: ['./calendar-new-event.component.scss'],
  animations: [fadeInOutAnimation]
})
export class CalendarNewEventComponent implements OnInit {
  public activeTab = 'Assignments';
  public iconRotationDegree = TextDirectionController.iconRotationDegree;

  public addEventForm: FormGroup;
  public selectedTeam: number;

  public teams: TeamDTO[] = [];
  public projects: ProjectDTO[] = [];
  public activeProjects: ProjectDTO[] = [];
  public users: string[] = [];

  attachments: FileDTO[] = [];

  domainName: string = DomainName;
  startingDate: moment.Moment;
  endingDate: moment.Moment;
  membersToInviteList: UserDTO[] = [];
  emailsToInviteList = [];

  // @Output() onAddEvent: EventEmitter<EventModel> = new EventEmitter<EventModel>();

  constructor(private teamService: TeamService,
              private calendarApiService: CalendarApiService,
              private calendarDataService: CalendarDataService,
              private dialogRef: MatDialogRef<CalendarNewEventComponent>,
              private fileService: FileService,
              private projectService: ProjectService,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public inputData: any) {
    this.teamService.getAllTeam().subscribe(teams => {
      this.teams = teams;
    });

    this.projectService.getActiveProjects().subscribe(projects => {
      this.activeProjects = projects;
      projects.forEach(project => {
        if (project.teamId === null) {
          this.projects.push(project);
        }
      });
    });

    this.startingDate = moment(inputData.startTime);
    this.endingDate = moment(inputData.endTime);
  }

  ngOnInit(): void {
    this.addEventForm = new FormGroup({
      Title: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      Description: new FormControl(null, [Validators.maxLength(2500)]),
      Link: new FormControl(null, [Validators.maxLength(2500)]),
      IsAllDay: new FormControl(false),
      StartTime: new FormControl(this.startingDate.toDate(), []),
      EndTime: new FormControl(this.endingDate.toDate(), []),
    });
  }

  clickSelectFile(): void {
    $('#fileInNewEvent').click();
  }

  uploadFile(event: UploadResponseModel) {
    event.value.successfulFileUpload.forEach(uploadedFile => {
      this.attachments.push(uploadedFile);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  checkStartEndTime() {
    return this.endingDate.diff(this.startingDate, 'minutes') >= 0;
  }

  openAddMember() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        memberList: this.membersToInviteList,
        mailList: this.emailsToInviteList,
        type: AddMemberDialogTypeEnum.inviteMemberToEvent
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result[0] != null) {
        for (let index = 0; index < result[0].length; index++) {
          this.membersToInviteList.push(result[0][index]);
        }
      }
      if (result[1] != null) {
        for (let index = 0; index < result[1].length; index++) {
          if (!this.emailsToInviteList.includes(result[1][index])) {
            this.emailsToInviteList.push(result[1][index]);
          }
        }
      }      
    });
  }
  removeItemFromList(list, item) {
    let index = list.indexOf(item);
    list.splice(index, 1);
  }

  async addEvent() {    
    const attachmentsGuids: string[] = [];
    this.attachments.forEach((attachment) => {
      attachmentsGuids.push(attachment.fileContainerGuid);
    });
    if (this.startingDate !== null && this.endingDate !== null) {
      if (this.checkStartEndTime()) {
        let usersId = [];
        this.membersToInviteList.forEach(user => {
          usersId.push(user.userId);
        });
        const eventModel = new EventModel(
          this.addEventForm.controls.Title.value,
          this.addEventForm.controls.Description.value,
          this.addEventForm.controls.IsAllDay.value,
          this.addEventForm.controls.Link.value,
          this.startingDate.toDate(),
          this.endingDate.toDate(),
          null,
          [],
          [],
          attachmentsGuids,
          usersId,
          this.emailsToInviteList);

        this.calendarApiService.createEvent(eventModel).subscribe(result => {          
          this.calendarDataService.createdNewEvent(result.value);
        }, async err => {          
          const errors = [];
          if (err.error.hasError) {
            if (err.error.errors) {              
              err.error.errors.forEach(error => {
                errors.push(error);
              });
            } else {
              errors.push('Something Went Wrong.');
            }
          }
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i++) {
              this.openSnackBar(errors[i].toString(), await this.translate.get('Buttons.gotIt').toPromise());
              await (new Promise(resolve => setTimeout(resolve, 2000)));
            }
          }
        });
      } else {
        this.openSnackBar(await this.translate.get('Snackbar.invalidDateTimeSelected').toPromise(), await this.translate.get('Buttons.gotIt').toPromise());
      }
    } else {
      this.openSnackBar(await this.translate.get('Snackbar.invalidDateTime').toPromise(), await this.translate.get('Buttons.gotIt').toPromise());
    }
  }
}
