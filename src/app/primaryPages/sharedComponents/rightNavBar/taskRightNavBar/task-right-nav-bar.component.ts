import {
  Component,
  Directive,
  HostListener,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {MainWithInspectorService} from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import {GeneralTaskDTO} from '../../../../DTOs/kanban/GeneralTaskDTO';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KanbanService} from '../../../../services/kanbanService/kanban.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  AddProjectComponent,
  AddTaskComponent,
} from '../../../../pages/kanban/to-do.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {ChecklistItemDTO} from '../../../../DTOs/kanban/ChecklistItemDTO';
import {CheckListDTO} from '../../../../DTOs/kanban/CheckListDTO';
import {FileService} from '../../uploadFile/fileService/file.service';
import {DomainName} from '../../../../utilities/PathTools';
import {AssignTaskDTO} from '../../../../DTOs/kanban/AssignTaskDTO';
import {StatusDTO} from '../../../../DTOs/kanban/StatusDTO';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {DirectionService} from '../../../../services/directionService/direction.service';
import * as $ from 'jquery';
import {UploadResponseModel} from '../../../../DTOs/responseModel/UploadResponseModel';
import {AddAttachmentDTO} from '../../../../DTOs/kanban/AddAttachmentDTO';
import {AddTeam} from '../../header/projectHeader/project-header.component';
import {Router} from '@angular/router';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {ProjectService} from '../../../../services/projectService/project.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {JWTTokenService} from '../../../../services/accountService/jwttoken.service';
import {EstimationDTO} from '../../../../DTOs/kanban/EstimationDTO';
import {ShowMessageInDialogComponent} from '../../showMessageInDialog/show-message-in-dialog.component';
import {ButtonTypeEnum} from '../../../../enums/ButtonTypeEnum';
import {ChecklistItemPostDTO} from '../../../../DTOs/kanban/ChecklistItemPostDTO';
import {AddMemberDialogTypeEnum} from '../../../../enums/AddMemberDialogTypeEnum';
import {AddMemberDialogComponent} from '../../add-member-dialog/add-member-dialog.component';
import {BooleanInput} from '@angular/cdk/coercion';
import {DateTimePickerComponent} from '../../dateTimePicker/date-time-picker.component';
import * as moment from 'moment';
import {DialogMessageEnum} from 'src/app/enums/DialogMessageEnum';
import {AddTagDTO} from '../../../../DTOs/kanban/AddTagDTO';
import {TagDTO} from '../../../../DTOs/kanban/TagDTO';
import {DataService} from '../../../../services/dataService/data.service';
import {ReminderComponent} from '../../reminder/reminder.component';
import {ReminderResponseModel} from 'src/app/DTOs/kanban/ReminderResponseModel';
import {CalendarService} from 'src/app/services/calendarService/calendar.service';

// @Directive({
//   selector: '[ifChanges]'
// })
// export class IfChangesDirective {
//   private currentValue: any;
//   private hasView = false;
//
//   constructor(
//     private viewContainer: ViewContainerRef,
//     private templateRef: TemplateRef<any>
//   ) { }
//
//   @Input() set ifChanges(val: any) {
//     if (!this.hasView) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//       this.hasView = true;
//     } else if (val !== this.currentValue) {
//       this.viewContainer.clear();
//       this.viewContainer.createEmbeddedView(this.templateRef);
//       this.currentValue = val;
//     }
//   }
// }

@Component({
  selector: 'app-task-right-navbar',
  templateUrl: './task-right-nav-bar.component.html',
  styleUrls: ['./task-right-nav-bar.component.scss'],
  animations: [
    trigger('showHideButton', [
      state(
        'show',
        style({
          opacity: 1,
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
        })
      ),
      transition('hide => show', animate('0.1s ease-in')),
      transition('show => hide', animate('0.1s ease-out')),
    ]),
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}), animate(100)]),
      transition(':leave', animate(100, style({opacity: 0}))),
    ]),
    trigger('inspectorAnimation', [
      state('in', style({opacity: 1})),
      state('out', style({opacity: 0})),
      transition('* => in', [animate('100ms linear')]),
      transition('* => out', [animate('100ms linear')]),
    ]),
  ],
})
export class TaskRightNavBarComponent implements OnInit {
  inspectorAnimationOn = true;

  currentUser: string;

  selectedTask: GeneralTaskDTO;
  height = window.innerHeight;
  panelOpenState = true;

  editTitle = false;
  editTitleClicked = false;

  editDescription = false;
  editDescriptionClicked = false;

  editTeam = false;
  editProject = false;

  editAssignee = false;
  isRemovingAssignee: boolean[] = [];

  editAttachment = false;
  isRemovingAttachment = '';

  editTags = false;
  isRemovingTag: boolean[] = [];

  editStartDate = false;
  editEndDate = false;

  editChecklist = false;
  isRemovingChecklist: boolean[] = [];
  isRemovingChecklistItem: boolean[] = [];

  isAddingChecklist = false;

  statuses: StatusDTO[] = [];
  allStatuses: StatusDTO[] = [];

  editEstimations = false;
  editEstimationClicked = false;
  editReminders = false;
  isRemovingReminder = '';
  addEstimationClicked = false;
  addEstimation = false;
  isRemovingEstimation: boolean[] = [];
  estimationHourEdit: number;
  estimationMinuteEdit: number;

  editForm: FormGroup;
  editingTask: GeneralTaskDTO;
  domainName: string = DomainName;
  iconRotationDegree = TextDirectionController.iconRotationDegree;
  changeToInput: boolean[] = [];

  /*header tabs */
  isSelected = 'General';
  tooltipMessage = 'Copy!';
  checkListClick: boolean;

  changeTitleAnimationFinished = true;
  changeDescriptionAnimationFinished = true;
  changeChecklistAnimationFinished = true;
  changeTeamNameAnimationFinished = true;

  isHoveringTag: number;
  reminders: ReminderResponseModel[];
  gotReminders = false;
  betaUser: boolean = false;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  constructor(
    private mainWithInspectorService: MainWithInspectorService,
    private kanbanService: KanbanService,
    private fileService: FileService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private jwtTokenService: JWTTokenService,
    private directionService: DirectionService,
    private dataService: DataService,
    public dialog: MatDialog,
    public translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    // console.log('TaskRightNavBarComponent ngOnInit');
    this.betaUser = this.jwtTokenService.isUserBeta();
    this.checkListClick = true;
    this.currentUser = this.jwtTokenService.getCurrentUserId();

    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });

    this.mainWithInspectorService.currentEditingTask.subscribe((message) => {
      this.editingTask = message;
      // this.selectedTask = message;
    });

    this.editForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Description: new FormControl(null),
      ChecklistTitle: new FormControl(null),
      estimationHour: new FormControl(null),
      estimationMinute: new FormControl(null),
    });

    this.mainWithInspectorService.currentAllStatuses.subscribe(message => {
      // console.log('all statuses');
      // console.log(message);
      this.allStatuses = message;
    });

    this.mainWithInspectorService.currenttask.subscribe((message) => {
      if (message == null) {
        this.selectedTask = null;
        return;
      }
      this.reminders = [];
      this.gotReminders = false;
      if (this.selectedTask != null && message.id !== this.selectedTask.id) {
        // console.log('ay');
        setTimeout(() => {
          this.inspectorAnimationOn = false;
        }, 100);
        setTimeout(() => {
          this.selectedTask = message;
          this.inspectorAnimationOn = true;
        }, 100);
        this.inspectorAnimationOn = false;
      } else {
        this.selectedTask = message;
      }
      this.kanbanService.getReminders(this.selectedTask.id).subscribe(reminders => {
        this.reminders = reminders.value;
        this.reminders.forEach(reminder => {
          reminder.remindOn = new Date(CalendarService.convertUtcToLocalTime(reminder.remindOn, 'YYYY-MM-DDTHH:mm:ss'));
        });
        this.gotReminders = true;
      });
      this.editTitle = false;
      this.editTitleClicked = false;
      this.editDescription = false;
      this.editDescriptionClicked = false;
      this.isAddingChecklist = false;
      this.addEstimationClicked = false;
      this.editForm.controls.estimationHour.reset();
      this.editForm.controls.estimationMinute.reset();
      this.editForm.controls.ChecklistTitle.reset();

      // kihoihoih njhgkjbkjbkj
      this.statuses = [];
      // this.getStatuses();
      if (this.selectedTask == null) {
        console.log('problem in statuses beacuse selectedTask is null');
      }
      if (this.selectedTask.projectId != null) {
        // this.allStatuses.forEach(s => {
        //   if (s.projectId === this.selectedTask.projectId) {
        //     this.statuses.push(s);
        //   }
        // });
        for (let s of this.allStatuses) {
          if (s.projectId === this.selectedTask.projectId) {
            this.statuses.push(s);
          }
        }
      } else if (this.selectedTask.teamId != null) {
        // this.allStatuses.forEach(s => {
        //   if (s.teamId === this.selectedTask.teamId) {
        //     this.statuses.push(s);
        //   }
        // });
        for (let s of this.allStatuses) {
          if (s.teamId === this.selectedTask.teamId) {
            this.statuses.push(s);
          }
        }
      } else if (this.selectedTask.teamId == null && this.selectedTask.projectId == null) {
        // handle personal tasks
        // this.allStatuses.forEach(s => {
        //   if (s.userProfileId != null) {
        //     this.statuses.push(s);
        //   }
        // });
        for (let s of this.allStatuses) {
          if (s.userProfileId != null) {
            this.statuses.push(s);
          }
        }
      } else {
        console.log('Problem in statuses because none of the conditions are met');
      }
      // console.log(this.statuses);
      // console.log(this.allStatuses);

    });


  }

  isUserBeta() {
    return this.jwtTokenService.isUserBeta();
  }

  /*header select Tab managment */
  tabSelectes(tabItem) {
    this.isSelected = tabItem;
  }

  /* clipboard copy snakbar */
  async clipboardCopy(checkText) {
    if (checkText !== null) {
      this._snackBar.open(
        await this.translateService.get('Snackbar.copyToClipboard').toPromise(),
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

  private getStatuses() {
    if (this.selectedTask != null) {
      this.kanbanService
        .getStatuses(this.selectedTask.teamId, this.selectedTask.projectId)
        .subscribe(
          (res) => {
            this.statuses = res.value;
          },
          async (err) => {
            this._snackBar.open(
              'Problem getting statuses in inspector',
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

  changeStatus(event) {
    // console.log(event);
    const selectedTask: GeneralTaskDTO = {...this.selectedTask};
    // console.log('selectedTask:');
    // console.log(selectedTask);
    // console.log('this.selectedTask:');
    // console.log(this.selectedTask);
    // console.log('event.source');
    // console.log(event.source);
    this.kanbanService
      .updateStatus(this.selectedTask.id, event.value)
      .subscribe(
        async (res) => {
          selectedTask.statusId = event.value;
          selectedTask.statusTitle = event.source.triggerValue;
          this.mainWithInspectorService.changeEditingTaskFromInspector(selectedTask);
          // this.mainWithInspectorService.changeEditingTask(selectedTask);


          this._snackBar.open(
            await this.translateService
              .get('Snackbar.taskStatusChanged')
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
        async (err) => {
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.cantChangeStatus')
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

  cancelEdit() {
    this.editTitleClicked = false;
  }

  modifyTitle() {
    const newTitle = this.editForm.controls.Title.value.replace(/\n+$/, '');
    this.editTitleClicked = false;
    if (newTitle === this.selectedTask.title || newTitle === '') {
      return;
    }

    this.kanbanService.updateTitle(this.selectedTask.id, newTitle).subscribe(
      async (res) => {
        this.selectedTask.title = newTitle;
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService.get('Snackbar.taskTitleUpdated').toPromise(),
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
          await this.translateService.get('Snackbar.editTaskTitleError').toPromise(),
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
    const newDescription = this.editForm.controls.Description.value.replace(
      /\n+$/,
      ''
    );
    this.editDescriptionClicked = false;
    if (newDescription === this.selectedTask.description) {
      return;
    }

    this.kanbanService
      .updateDescription(
        this.selectedTask.id,
        newDescription === '' ? null : newDescription
      )
      .subscribe(
        async (res) => {
          this.selectedTask.description =
            newDescription === '' ? null : newDescription;
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this._snackBar.open(
            await this.translateService.get('Snackbar.taskDescriptionUpdated').toPromise(),
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
            await this.translateService.get('Snackbar.editTaskDescriptionError').toPromise(),
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

  removeAssignee(userId: string) {
    this.kanbanService
      .deleteUserAssignedTo(this.selectedTask.id, userId)
      .subscribe(
        async (res) => {
          this.selectedTask.usersAssignedTo =
            this.selectedTask.usersAssignedTo.filter(
              (u) => u.userId !== userId
            );
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this._snackBar.open(
            await this.translateService.get('Snackbar.taskMembersUpdated').toPromise(),
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
            await this.translateService.get('Snackbar.editTaskAssigneesError').toPromise(),
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

  modifyChecklistItem(event, item: ChecklistItemDTO) {
    // console.log(event.checked);
    this.kanbanService
      .updateCheckListItemIsChecked(item.id, event.checked)
      .subscribe(
        async (res) => {
          this.selectedTask.checkListItems.forEach((checklistItem) => {
            if (checklistItem.id === item.id) {
              checklistItem.isChecked = event.checked;
            }
          });
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.checklistStatusChanged')
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
              .get('Snackbar.checklistStatusChangeFailed')
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

  /* Edit each check list title*/
  editChecklistItem(event: any, item: ChecklistItemDTO, index: number) {
    const textValue = event;

    this.kanbanService.updateCheckListText(item.id, textValue).subscribe(
      async (res) => {
        this.selectedTask.checkListItems.forEach((checklistItem) => {
          if (checklistItem.id === item.id) {
            item.title = textValue;
            this.changeToInput[index] = false;
          }
        });
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.checklistStatusChanged')
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
            .get('Snackbar.checklistStatusChangeFailed')
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
  removeChecklistItem(item: ChecklistItemDTO) {
    this.kanbanService.deleteChecklistItem(item.id).subscribe(
      async (res) => {
        // this.selectedTask.checkListItems.forEach((c) => {
        //   if (c.id === item.id) {
        //     c.items = c.items.filter((i) => i.id !== item.id);
        //   }
        // });
        this.selectedTask.checkListItems =
          this.selectedTask.checkListItems.filter((ci) => ci.id !== item.id);
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.checklistItemRemovedSuccessfully')
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
            .get('Snackbar.checklistItemRemoveFailed')
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

  addNewEstimation() {
    const selectedTask: GeneralTaskDTO = {...this.selectedTask};
    const estimationTimeHour =
      this.editForm.controls.estimationHour.value != null
        ? +this.editForm.controls.estimationHour.value
        : 0;
    const estimationTimeMinute =
      this.editForm.controls.estimationMinute.value != null
        ? +this.editForm.controls.estimationMinute.value
        : 0;
    // console.log(estimationTimeHour);
    // console.log(estimationTimeMinute);
    const estimationTimeInMinute =
      estimationTimeHour * 60 + estimationTimeMinute;
    this.kanbanService
      .addTaskEstimationTime(selectedTask.id, estimationTimeInMinute)
      .subscribe(
        async (res) => {
          this.selectedTask.estimations.push(
            new EstimationDTO(
              estimationTimeInMinute,
              this.jwtTokenService.getCurrentUser()
            )
          );
          this.mainWithInspectorService.changeEditingTask(selectedTask);
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.estimationAddedSuccessfully')
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
              .get('Snackbar.estimationAddingFailed')
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
    this.cancelAddingEstimationTime();
  }

  openEditDateDialog(startOrEnd: string) {
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        dateTime: startOrEnd === 'start' ?
          (this.selectedTask.startDate ? this.selectedTask.startDate : new Date()) :
          (this.selectedTask.endDate ? this.selectedTask.endDate : new Date())
      }
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }
      let newDatetime = res.newDatetime;
      if (startOrEnd === 'start') {
        if ((this.selectedTask.endDate && moment(this.selectedTask.endDate).diff(moment(newDatetime)) >= 0) ||
          this.selectedTask.endDate === null) {
          this.kanbanService
            .editTaskStartDate(this.selectedTask.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                this.selectedTask.startDate = newDatetime;
                this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                this._snackBar.open(
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
                this._snackBar.open(
                  await this.translateService.get('Snackbar.editDateError').toPromise(),
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
          this._snackBar.open(
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
        if ((this.selectedTask.startDate && moment(this.selectedTask.startDate).diff(moment(newDatetime)) <= 0) ||
          this.selectedTask.startDate === null) {
          this.kanbanService
            .editTaskEndDate(this.selectedTask.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                this.selectedTask.endDate = newDatetime;
                this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                this._snackBar.open(
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
                this._snackBar.open(
                  await this.translateService.get('Snackbar.editDateError').toPromise(),
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
          this._snackBar.open(
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

  async deleteTaskDate(startOrEnd: string) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: startOrEnd === 'start' ? DialogMessageEnum.deleteTaskStartDate : DialogMessageEnum.deleteTaskEndDate,
        itemName: this.selectedTask.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          if (startOrEnd === 'start') {
            this.kanbanService
              .editTaskStartDate(this.selectedTask.id, '')
              .subscribe(async res => {
                  this.selectedTask.startDate = null;
                  this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                  this._snackBar.open(
                    await this.translateService.get('Snackbar.deletedDatetime').toPromise(),
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
                    await this.translateService.get('Snackbar.deleteDateError').toPromise(),
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
          } else if (startOrEnd === 'end') {
            this.kanbanService
              .editTaskEndDate(this.selectedTask.id, '')
              .subscribe(async res => {
                  this.selectedTask.endDate = null;
                  this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                  this._snackBar.open(
                    await this.translateService.get('Snackbar.deletedDatetime').toPromise(),
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
                    await this.translateService.get('Snackbar.deleteDateError').toPromise(),
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
      }
    });
  }

  editEstimation(estimation: EstimationDTO) {
    const userId = this.jwtTokenService.getCurrentUserId();
    const estimationTimeInMinute =
      (this.estimationHourEdit != null
        ? +this.estimationHourEdit
        : Math.floor(estimation.estimationTimeInMinute / 60)) *
      60 +
      (this.estimationMinuteEdit != null
        ? +this.estimationMinuteEdit
        : estimation.estimationTimeInMinute % 60);
    if (
      estimation.estimationTimeInMinute === estimationTimeInMinute ||
      estimationTimeInMinute === 0
    ) {
      this.editEstimationClicked = false;
      return;
    }
    this.kanbanService
      .updateEstimationTime(this.selectedTask.id, estimationTimeInMinute)
      .subscribe(
        async (res) => {
          this.selectedTask.estimations = this.selectedTask.estimations.filter(
            (est) => est.user.userId !== userId
          );
          this.selectedTask.estimations.push(
            new EstimationDTO(
              estimationTimeInMinute,
              this.jwtTokenService.getCurrentUser()
            )
          );
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.estimationEditedSuccessfully')
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
              .get('Snackbar.estimationEditingFailed')
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
    this.editEstimationClicked = false;
  }

  changeHourEdit(event, estimation: EstimationDTO) {
    // console.log('hour');
    // console.log(event.target.value);
    // console.log(estimation);
    this.estimationHourEdit = event.target.value;
  }

  changeMinuteEdit(event, estimation: EstimationDTO) {
    // console.log('minute');
    // console.log(event.target.value);
    // console.log(estimation);
    this.estimationMinuteEdit = event.target.value;
  }

  floor(num: number) {
    return Math.floor(num);
  }

  cancelAddingEstimationTime() {
    this.addEstimationClicked = false;
    this.editForm.controls.estimationHour.reset();
    this.editForm.controls.estimationMinute.reset();
  }

  removeEstimation() {
    const userId = this.jwtTokenService.getCurrentUserId();
    this.kanbanService.deleteEstimationTime(this.selectedTask.id).subscribe(
      async (res) => {
        this.selectedTask.estimations = this.selectedTask.estimations.filter(
          (estimation) => estimation.user.userId !== userId
        );
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.estimationRemovedSuccessfully')
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
            .get('Snackbar.estimationRemoveFailed')
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

  currentUserHasEstimation() {
    return (
      this.selectedTask.estimations.findIndex(
        (estimation) => estimation.user.userId === this.currentUser
      ) !== -1
    );
  }

  onValChange(value) {
    let newPriority = 1;
    // console.log(value);
    if (value === '1') {
      newPriority = 1;
    } else if (value === '3') {
      newPriority = 3;
    } else if (value === '5') {
      newPriority = 5;
    }
    if (this.selectedTask.priorityId === newPriority) {
      return;
    }

    this.kanbanService
      .updatePriority(this.selectedTask.id, newPriority)
      .subscribe(
        async (res) => {
          if (
            TextDirectionController.textDirection === 'rtl' &&
            localStorage.getItem('languageCode') === 'fa-IR'
          ) {
            if (value === '1') {
              this.selectedTask.priorityTitle = 'پایین';
            } else if (value === '3') {
              this.selectedTask.priorityTitle = 'متوسط';
            } else if (value === '5') {
              this.selectedTask.priorityTitle = 'بالا';
            }
          } else {
            if (value === '1') {
              this.selectedTask.priorityTitle = 'Low';
            } else if (value === '3') {
              this.selectedTask.priorityTitle = 'Medium';
            } else if (value === '5') {
              this.selectedTask.priorityTitle = 'High';
            }
          }
          // this.selectedTask.priorityTitle =;
          this.selectedTask.priorityId = newPriority;
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this._snackBar.open(
            await this.translateService.get('Snackbar.taskPriorityUpdated').toPromise(),
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
            await this.translateService.get('Snackbar.editTaskPriorityError').toPromise(),
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

  openAddMemberDialog() {
    const copyOfMembers = this.selectedTask.usersAssignedTo.map((x) =>
      Object.assign({}, x)
    );
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToTask,
        memberList: this.selectedTask.usersAssignedTo,
        teamId: this.selectedTask.teamId,
        projectId: this.selectedTask.projectId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('copy is:');
      // console.log(copyOfMembers);
      // console.log('selected is:');
      // console.log(this.selectedTask.usersAssignedTo);

      const newAssignees: string[] = [];
      result[0].forEach((a) => {
        if (copyOfMembers.findIndex((u) => u.userId === a.userId) === -1) {
          if (this.selectedTask.usersAssignedTo.findIndex((u) => u.userId === a.userId) === -1) {
            newAssignees.push(a.userId);
            this.selectedTask.usersAssignedTo.push(a);
          }

        }
      });
      // console.log('newAssignees');
      // console.log(newAssignees);
      if (newAssignees.length <= 0) {
        return;
      }
      const assignTask = new AssignTaskDTO(this.selectedTask.id, newAssignees);
      this.kanbanService.assignTask(assignTask).subscribe(
        async (res) => {
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.addedNewAssignees')
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
            await this.translateService.get('Snackbar.editTaskAssigneesError').toPromise(),
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
    });
  }

  openEditTeamDialog() {
    const dialogRef = this.dialog.open(EditTeamAndProjectComponent, {
      data: {
        selectedTask: this.selectedTask,
      },
      direction:
        TextDirectionController.textDirection === 'rtl' ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openAddReminderDialog() {
    const dialogRef = this.dialog.open(ReminderComponent, {
      data: {
        selectedTask: this.selectedTask,
      },
      direction:
        TextDirectionController.textDirection === 'rtl' ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.kanbanService.addReminder(result).subscribe(res => {
          this.reminders.push(res.value);
        });
      }
    });
  }

  removeReminder(reminderId: number) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteReminder
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.kanbanService.deleteReminder(reminderId).subscribe(
            async (res) => {
              this.reminders = this.reminders.filter(x => x.reminderId !== reminderId);
              this._snackBar.open(
                await this.translateService
                  .get('Snackbar.deletedReminderSuccessfully')
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
                  .get('Snackbar.cantRemoveReminder')
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
    });
  }

  openAddItemDialog(checklistItems: ChecklistItemDTO[]) {
    const dialogRef = this.dialog.open(AddChecklistItemFromInspectorComponent, {
      data: {
        checklistItems: checklistItems,
        selectedTask: this.selectedTask,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(this.selectedTask.usersAssignedTo);
      // this.kanbanService.as
    });
  }

  // openDeleteChecklistDialog(checklist: CheckListDTO) {
  //   const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
  //     minWidth: '100px',
  //     data: {
  //       buttonNumbers: 2,
  //       buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
  //       messageText: 'deleteChecklist',
  //       itemName: checklist.title,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       if (result === ButtonTypeEnum.delete) {
  //         this.removeChecklist(checklist.id);
  //       }
  //     }
  //   });
  // }

  goToProject(projectId: number) {
    this.router.navigateByUrl('project/projectOverview/' + projectId);
  }

  goToTeam(teamId: number) {
    this.router.navigateByUrl('team/teamOverview/' + teamId);
  }

  clickSelectFile(): void {
    $('#fileInInspector').click();
  }

  uploadFile(event: UploadResponseModel) {
    // this.selectedTask.attachments.push(event.value.successfulFileUpload[0]);
    const attachments = [];
    for (let i = 0; i < event.value.successfulFileUpload.length; i++) {
      attachments.push(event.value.successfulFileUpload[i].fileContainerGuid);
      this.selectedTask.attachments.push(event.value.successfulFileUpload[i]);
    }
    // event.value.successfulFileUpload.forEach(f => {
    //   attachments.push(f.fileContainerGuid);
    //   this.selectedTask.attachments.push(f);
    // });
    this.kanbanService
      .addAttachment(new AddAttachmentDTO(this.selectedTask.id, attachments))
      .subscribe(
        async (res) => {
          // console.log(res);
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          // this._snackBar.open(
          //   await this.translateService.get('Snackbar.uploadedSuccessfully').toPromise(),
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
        async (error) => {
          this._snackBar.open(
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

  removeAttachment(fileId) {
    this.selectedTask.attachments = this.selectedTask.attachments.filter(
      (a) => a.fileContainerGuid !== fileId
    );
    this.kanbanService.deleteAttachment(this.selectedTask.id, fileId).subscribe(
      async (res) => {
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
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
        this._snackBar.open(
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

  addTagToTask(taskId: number, tagTitle: string) {
    const tagToAdd = new AddTagDTO(taskId, tagTitle);
    this.kanbanService.addTagToTask(tagToAdd).subscribe(
      async (res) => {
        this.selectedTask.tags.push(new TagDTO(tagTitle));
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.addedTagSuccessfully')
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
            .get('Snackbar.addTagError')
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

  deleteTag(event, taskId: number, tagTitle: string) {
    event.stopPropagation();
    this.kanbanService.deleteTag(taskId, tagTitle).subscribe(
      async (res) => {
        this.selectedTask.tags = this.selectedTask.tags.filter(t => t.title !== tagTitle);
        this.mainWithInspectorService.changeEditingTask(this.selectedTask);
        this._snackBar.open(
          await this.translateService
            .get('Snackbar.deletedTagSuccessfully')
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
            .get('Snackbar.deleteTagError')
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

  filterByTag(tagTitle: string) {
    this.dataService.changeTagFromInspector(tagTitle);
  }
}

@Component({
  selector: 'add-checklist-item-from-inspector',
  templateUrl: 'AddChecklistItemFromInspector.html',
  styleUrls: ['./AddChecklistItemFromInspector.scss'],
})
export class AddChecklistItemFromInspectorComponent implements OnInit {
  items: ChecklistItemDTO[] = this.inputData.checklistItems;
  addItemForm = new FormGroup({
    title: new FormControl(),
  });
  textDirection = TextDirectionController.getTextDirection();

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private _snackBar: MatSnackBar,
    private kanbanService: KanbanService,
    private mainWithInspectorService: MainWithInspectorService,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    public translateService: TranslateService
  ) {
  }

  ngOnInit() {
  }

  addItem() {
    const addingChecklistItem = new ChecklistItemPostDTO(
      this.addItemForm.controls.title.value,
      false
    );

    this.kanbanService
      .addChecklistItem(this.inputData.selectedTask.id, addingChecklistItem)
      .subscribe(
        async (res) => {
          if (this.items.find(item => item.id === res.value.id)) {
            //Item already exists
          } else {
            this.items.splice(0, 0, res.value);
            this.mainWithInspectorService.changeEditingTask(
              this.inputData.selectedTask
            );
          }
          this._snackBar.open(
            await this.translateService.get('Snackbar.taskChecklistItemAdded').toPromise(),
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
            await this.translateService.get('Snackbar.addChecklistItemError').toPromise(),
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
    this.addItemForm.controls.title.reset();
  }

  removeItem(i: ChecklistItemDTO) {
    this.inputData.currentChecklist.items =
      this.inputData.currentChecklist.items.filter(
        (item) => item.title !== i.title
      );
  }

  sumbit() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'edit-team-and-project',
  templateUrl: 'EditTeamAndProject.html',
  styleUrls: ['./EditTeamAndProject.scss'],
})
export class EditTeamAndProjectComponent implements OnInit {
  textDirection = TextDirectionController.textDirection;
  domainName: string = DomainName;
  public selectedTeamFromAddTeamComponent: Array<any> = [];
  public selectedProjectFromAddProjectComponent: Array<any> = [];
  public teamDepartments: Array<any> = [];
  public memberList: Array<any> = [];
  activeTab = 'Assignments';
  activeTeam = '';
  allTeams = [];
  activeProjects = [];
  activeProject = '';
  showingProjects = [];
  iconRotationDegree = TextDirectionController.iconRotationDegree;
  selectedTask: GeneralTaskDTO = {...this.inputData.selectedTask};

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private router: Router,
    private _snackBar: MatSnackBar,
    private teamService: TeamService,
    private projectService: ProjectService,
    private kanbanService: KanbanService,
    private mainWithInspectorService: MainWithInspectorService,
    private directionService: DirectionService,
    private dialogref: MatDialogRef<EditTeamAndProjectComponent>,
    public dialog: MatDialog,
    public translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
    });
    this.teamService.getAllTeam().subscribe((res) => {
      this.allTeams = res;
    });
    this.projectService.getActiveProjects().subscribe((res) => {
      this.activeProjects = res;
      res.forEach((p) => {
        if (p.teamId == null) {
          this.showingProjects.push(p);
        }
      });
    });
  }

  selectTeam(id) {
    this.activeProject = '';
    this.memberList.length = 0;
    this.activeTeam = id;
    this.teamDepartments.length = 0;
    this.showingProjects = [];
    this.activeProjects.forEach((project) => {
      if (project.teamId === id) {
        // console.log(project);
        this.showingProjects.push(project);
      }
    });
  }

  unselectTeam() {
    this.showingProjects = [];
    this.activeProjects.forEach((project) => {
      if (project.teamId == null) {
        this.showingProjects.push(project);
      }
    });
    this.activeTeam = '';
    this.activeProject = '';
    this.teamDepartments.length = 0;
  }

  openTeamPage() {
    this.router.navigateByUrl('team');
  }

  openAddTeam(): void {
    this.selectedTeamFromAddTeamComponent.length = 0;
    const dialogRef = this.dialog.open(AddTeam, {
      data: {
        activeTeam: this.selectedTeamFromAddTeamComponent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(this.selectedTeamFromAddTeamComponent);
      if (this.selectedTeamFromAddTeamComponent.length > 0) {
        this.selectTeam(this.selectedTeamFromAddTeamComponent[0].id);
      }
    });
  }

  openProjectPage() {
    this.router.navigateByUrl('project');
  }

  openAddProject(): void {
    this.selectedProjectFromAddProjectComponent.length = 0;
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: {
        activeProject: this.selectedProjectFromAddProjectComponent,
        selectedTeam: this.activeTeam,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(this.selectedProjectFromAddProjectComponent);
      if (this.selectedProjectFromAddProjectComponent.length > 0) {
        this.selectProject(this.selectedProjectFromAddProjectComponent[0].id);
      }
    });
  }

  selectProject(id) {
    // console.log('This project was selected: ' + id);
    this.activeProject = id;
  }

  unselectProject() {
    this.activeProject = '';
  }

  updateTeamAndProject() {
    const tId = this.activeTeam === '' ? null : this.activeTeam;
    const pId = this.activeProject === '' ? null : this.activeProject;

    this.kanbanService
      .updateTeamAndProject(
        this.selectedTask.id,
        +tId === 0 ? null : +tId,
        +pId === 0 ? null : +pId
      )
      .subscribe(
        async (res) => {
          // this.inputData.selectedTask = null;
          this.selectedTask.teamId = res.value.teamId;
          this.selectedTask.projectId = res.value.projectId;
          this.selectedTask.teamName = res.value.teamName;
          this.selectedTask.projectName = res.value.projectName;
          this.selectedTask.statusId = res.value.statusId;
          this.selectedTask.statusTitle = res.value.statusTitle;
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          // this.selectedTask = res.value;
          // this.inputData.selectedTask = null;
          // this.selectedTask = null;
          this.mainWithInspectorService.changeMessage(null);
          // tslint:disable-next-line:max-line-length
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.editTeamAndProjectSuccessfully')
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
          this.dialogref.close();
        },
        async (err) => {
          // tslint:disable-next-line:max-line-length
          this._snackBar.open(
            await this.translateService
              .get('Snackbar.editTeamAndProjectFailed')
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
          this.dialogref.close();
        }
      );
  }
}
