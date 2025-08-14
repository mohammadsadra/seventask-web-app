import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {ButtonTypeEnum} from 'src/app/enums/ButtonTypeEnum';
import {DialogMessageEnum} from 'src/app/enums/DialogMessageEnum';
import {CalendarApiService} from 'src/app/services/calendarService/calendarAPI/calendar-api.service';
import {CalendarDataService} from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {TextDirectionController} from 'src/app/utilities/TextDirectionController';
import * as moment from 'moment';
import {UploadResponseModel} from 'src/app/DTOs/responseModel/UploadResponseModel';
import {AddAttachmentDTO} from 'src/app/DTOs/kanban/AddAttachmentDTO';
import {FormControl, FormGroup} from '@angular/forms';
import {EventResponseModel} from 'src/app/DTOs/calendar/EventResponseModel';
import {DirectionService} from 'src/app/services/directionService/direction.service';
import {ShowMessageInDialogComponent} from '../showMessageInDialog/show-message-in-dialog.component';
import {DateTimePickerComponent} from '../dateTimePicker/date-time-picker.component';
import { DomainName } from 'src/app/utilities/PathTools';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  @Input('selectedEvent') selectedEvent: EventResponseModel;
  @Output() backButton = new EventEmitter<boolean>();
  iconRotationDegree = 0;
  editForm: FormGroup;
  hoveredOn = {
    title: false,
    description: false,
    link: false,
    startDate: false,
    endDate: false,
    attachment: false
  };
  edited = {
    title: false,
    description: false,
    link: false,
    startDate: false,
    endDate: false
  };
  isRemovingAttachment = '';
  domainName: string = DomainName;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private calendarDataService: CalendarDataService,
    private calendarApiService: CalendarApiService,
    private translateService: TranslateService,
    private directionService: DirectionService
  ) {
    this.directionService.currentRotation.subscribe(deg => {
      this.iconRotationDegree = deg;
    });
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      Title: new FormControl(null),
      Description: new FormControl(null),
      Link: new FormControl(null),
      StartDate: new FormControl(null),
      EndDate: new FormControl(null)
    });
  }

  backButtonSelected() {
    this.backButton.emit(true);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      panelClass: 'snack-bar-container',
      direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
    });
  }

  deleteEvent(eventId: number) {
    this.calendarApiService.deleteEvent(eventId).subscribe(async (success) => {
      this.selectedEvent = null;
      this.calendarDataService.deleteEvent(eventId);
      this.backButtonSelected();
      this.openSnackBar(await this.translateService.get('Snackbar.eventDeleted').toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise());
    }, async (error) => {
      this.openSnackBar(await this.translateService.get('Snackbar.deleteEventError').toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise());
    });
  }

  openDeleteEventDialog() {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteEvent,
        itemName: this.selectedEvent.title
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.deleteEvent(this.selectedEvent.id);
        }
      }
    });
  }

  openEditDate(startOrEnd: string) {
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        dateTime: startOrEnd === 'start' ? this.selectedEvent.startTime : this.selectedEvent.endTime
      }
    });
    dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }

      let newDatetime = res.newDatetime;
      if (startOrEnd === 'start') {
        if (moment(this.selectedEvent.endTime).diff(moment(newDatetime)) >= 0) {
          this.calendarApiService
            .editEventStartTime(this.selectedEvent.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                this.selectedEvent.startTime = newDatetime;
                this.calendarDataService.updateEvent(this.selectedEvent);
                this.snackBar.open(
                  await this.translateService.get('Snackbar.changedDatetime').toPromise(),
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
                this.snackBar.open(
                  await this.translateService.get('Snackbar.setEventStartTimeError').toPromise(),
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
        } else {
          this.snackBar.open(
            await this.translateService.get('Snackbar.invalidDateTimeSelected').toPromise(),
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
      } else if (startOrEnd === 'end') {
        if (moment(this.selectedEvent.startTime).diff(moment(newDatetime)) <= 0) {
          this.calendarApiService
            .editEventEndTime(this.selectedEvent.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                this.selectedEvent.endTime = newDatetime;
                this.calendarDataService.updateEvent(this.selectedEvent);
                this.snackBar.open(
                  await this.translateService.get('Snackbar.changedDatetime').toPromise(),
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
                this.snackBar.open(
                  await this.translateService.get('Snackbar.setEventEndTimeError').toPromise(),
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
        } else {
          this.snackBar.open(
            await this.translateService.get('Snackbar.invalidDateTimeSelected').toPromise(),
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
    });
  }

  selectFileToUpload() {
    $('#fileInInspector').click();
  }

  editAllDay() {
    this.selectedEvent.isAllDay = !this.selectedEvent.isAllDay;
    this.calendarApiService
    .editAllDay(this.selectedEvent.id, this.selectedEvent.isAllDay)
    .subscribe(async (success) => {
      this.calendarDataService.updateEvent(this.selectedEvent);
      this.snackBar.open(
        await this.translateService.get('Snackbar.allDaySettingsChanged').toPromise(),
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
    }, async (error) => {
      this.snackBar.open(
        await this.translateService.get('Snackbar.editAllDayError').toPromise(),
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
    });
  }

  modifyTitle() {
    const newTitle = this.editForm.controls.Title.value.replace(/\n+$/, '');
    this.edited.title = false;
    if (newTitle === this.selectedEvent.title || newTitle === '') {
      return;
    }


    this.calendarApiService
      .editEventTitle(this.selectedEvent.id, newTitle)
      .subscribe(
        async (res) => {
          this.selectedEvent.title = newTitle;
          this.calendarDataService.updateEvent(this.selectedEvent);
          this.snackBar.open(
            await this.translateService.get('Snackbar.eventTitleChanged').toPromise(),
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
          this.snackBar.open(
            await this.translateService.get('Snackbar.editEventTitleError').toPromise(),
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

  modifyDescription() {
    const newDescription = this.editForm.controls.Description.value.replace(/\n+$/, '');
    this.edited.description = false;
    if (newDescription === this.selectedEvent.description) {
      return;
    }

    this.calendarApiService
      .editEventDescription(
        this.selectedEvent.id,
        newDescription === '' ? null : newDescription)
      .subscribe(
        async (res) => {
          this.selectedEvent.description =
            newDescription === '' ? null : newDescription;
          this.calendarDataService.updateEvent(this.selectedEvent);
          this.snackBar.open(
            await this.translateService.get('Snackbar.eventDescriptionChanged').toPromise(),
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
          this.snackBar.open(
            await this.translateService.get('Snackbar.editEventDescriptionError').toPromise(),
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

  modifyLink() {
    const newLink = this.editForm.controls.Link.value.replace(/\n+$/, '');
    this.edited.link = false;
    if (newLink === this.selectedEvent.link || newLink === '') {
      return;
    }


    this.calendarApiService
      .editEventLink(this.selectedEvent.id, newLink)
      .subscribe(
        async (res) => {
          this.selectedEvent.link = newLink;
          this.calendarDataService.updateEvent(this.selectedEvent);
          this.snackBar.open(
            await this.translateService.get('Snackbar.eventLinkChanged').toPromise(),
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
          this.snackBar.open(
            await this.translateService.get('Snackbar.editEventLinkError').toPromise(),
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

  removeAttachment(fileId) {
    this.selectedEvent.attachments = this.selectedEvent.attachments.filter(
      (a) => a.fileContainerGuid !== fileId
    );
    this.calendarApiService.deleteEventAttachment(this.selectedEvent.id, fileId).subscribe(
      async (res) => {
        this.calendarDataService.updateEvent(this.selectedEvent);
        this.snackBar.open(
          await this.translateService
            .get('Snackbar.removedAttachmentSuccessfully')
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
        this.snackBar.open(
          await this.translateService
            .get('Snackbar.cantRemoveAttachment')
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

  uploadFile(event: UploadResponseModel) {
    this.selectedEvent.attachments.push(event.value.successfulFileUpload[0]);
    const attachments = [];
    attachments.push(event.value.successfulFileUpload[0].fileContainerGuid);
    this.calendarApiService
      .addEventAttachment(new AddAttachmentDTO(this.selectedEvent.id, attachments))
      .subscribe(
        async (res) => {
          this.calendarDataService.updateEvent(this.selectedEvent);
        },
        async (error) => {
          this.snackBar.open(
            await this.translateService
              .get('Snackbar.cantUploadFile')
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
}
