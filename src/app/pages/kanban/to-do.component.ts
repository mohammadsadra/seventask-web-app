import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  IterableDiffers,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {KanbanService} from '../../services/kanbanService/kanban.service';
import {GeneralTaskDTO} from '../../DTOs/kanban/GeneralTaskDTO';
import {MatAccordion} from '@angular/material/expansion';
import {GeneralTaskPostDTO} from '../../DTOs/kanban/GeneralTaskPostDTO';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {DataService} from '../../services/dataService/data.service';
import {MainWithInspectorService} from '../../services/mainWithInspectorService/main-with-inspector.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StatusDTO} from '../../DTOs/kanban/StatusDTO';
import {TeamService} from '../../services/teamSerivce/team.service';
import {ProjectService} from '../../services/projectService/project.service';
import {DateAdapter} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AddTeam} from '../../primaryPages/sharedComponents/header/projectHeader/project-header.component';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {ProjectDTO} from '../../DTOs/project/Project';
import {DomainName} from '../../utilities/PathTools';
import {TimeService} from '../../services/timeService/time.service';
import {GetRunningTasksResponseModel} from '../../DTOs/responseModel/GetRunningTasksResponseModel';
import * as $ from 'jquery';
import {UploadResponseModel} from '../../DTOs/responseModel/UploadResponseModel';
import {FileDTO} from '../../DTOs/file/FileDTO';
import {FileService} from '../../primaryPages/sharedComponents/uploadFile/fileService/file.service';
import {ShowMessageInDialogComponent} from '../../primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {TextDirectionController} from '../../utilities/TextDirectionController';
import {BaseFilterModel} from '../../DTOs/filter/BaseFilterModel';
import {TranslateService} from '@ngx-translate/core';
import {DirectionService} from '../../services/directionService/direction.service';
import {ButtonTypeEnum} from '../../enums/ButtonTypeEnum';
import {DialogMessageEnum} from '../../enums/DialogMessageEnum';
import {ChecklistItemPostDTO} from '../../DTOs/kanban/ChecklistItemPostDTO';
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {AddMemberDialogTypeEnum} from '../../enums/AddMemberDialogTypeEnum';
import {AddMemberDialogComponent} from '../../primaryPages/sharedComponents/add-member-dialog/add-member-dialog.component';
import {LoadingService} from '../../services/loadingService/loading.service';
import {fadeInOutAnimation} from 'src/animations/animations';
import {JWTTokenService} from '../../services/accountService/jwttoken.service';
import {SortTaskPipe} from 'src/app/pipes/sort-task.pipe';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {CalendarData, CalendarDay, CalendarService, Weekday} from 'src/app/services/calendarService/calendar.service';
import {CalendarTypeEnum} from 'src/app/enums/CalendarTypeEnum';
import {messageDTO} from '../../DTOs/chat/MessageDTO';
import {EnglishNumberToArabicNumberPipe} from '../../pipes/english-number-to-arabic-number.pipe';
import {FilterPipe} from '../../pipes/filter.pipe';

import {EditTeamAndProjectComponent} from '../../primaryPages/sharedComponents/rightNavBar/taskRightNavBar/task-right-nav-bar.component';
import {DateTimePickerComponent} from '../../primaryPages/sharedComponents/dateTimePicker/date-time-picker.component';
import {AssignTaskDTO} from '../../DTOs/kanban/AssignTaskDTO';
import {ChecklistItemDTO} from '../../DTOs/kanban/ChecklistItemDTO';
import {EstimationDTO} from '../../DTOs/kanban/EstimationDTO';
import {KanbanSettingsDTO} from '../../DTOs/kanban/KanbanSettingsDTO';
import {of} from 'rxjs';

export class CdkVirtualScrollCustomStrategyExample {
  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
}

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(50, 250, 500);
  }
}

@Component({
  selector: 'seven-task-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
  providers: [
    {provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy},
  ],
  animations: [
    trigger('slideDown', [
      state(
        'show',
        style({
          transform: 'translateY(0px)',
          'margin-bottom': '40px',
          // opacity: '1',
        })
      ),
      state(
        'hide',
        style({
          transform: 'translateY(-60px)',
          'margin-bottom': '-15px',
          // opacity: '0',
        })
      ),
      transition('hide => show', animate('0.23s ease-in')),
      transition('show => hide', animate('0.23s ease-out')),
    ]),
    // the fade-in/fade-out animation.
    trigger('fadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),
      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [style({opacity: 0}), animate(100)]),
      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate(1000, style({opacity: 0}))),
    ]),

    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({opacity: 0}),
            stagger('60ms', animate('180ms ease-out', style({opacity: 1}))),
          ],
          {optional: true}
        ),
        // query(':leave', animate('170ms', style({opacity: 0})), {
        //   optional: true,
        // }),
      ]),
    ]),

    // trigger('items', [
    //   transition(':enter', [
    //     style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
    //     animate(1000,
    //       style({ transform: 'scale(1)', opacity: 1 }))  // final
    //   ]),
    //   transition(':leave', [
    //     style({ transform: 'scale(1)', opacity: 1, height: '*' }),
    //     animate(1000,
    //       style({
    //         transform: 'scale(0.5)', opacity: 0,
    //         height: '0px', margin: '0px'
    //       }))
    //   ])
    // ])
  ],
})
export class ToDoComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private mainWithInspectorService: MainWithInspectorService,
    private kanbanService: KanbanService,
    private timeService: TimeService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private iterableDiffers: IterableDiffers,
    private calendarService: CalendarService,
    private jwtTokenService: JWTTokenService
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
    this.calendarData = calendarService.getCalendarData();
  }

  public get calendarType(): typeof CalendarTypeEnum {
    return CalendarTypeEnum;
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChildren('newTitle') newTitles: QueryList<ElementRef>;
  showGetTasksLoading = true;
  getTaskApisFinished = false;
  taskDropped = false;
  sortName = 'creationDate'; // According to sortName we must sort tasks
  isAscending = false; // Sort tasks ascending or descending based on this variable
  columnHeight;
  toDoView: string; // toDoView can be Board, List, etc
  selectedTask: GeneralTaskDTO;
  selectedTeam: TeamDTO; // According to selected project and selected team in LeftNavBar we must change showingTasks
  selectedProject: ProjectDTO; // According to selected team in LeftNavBar we must change showingTasks
  isPersonalSelected: boolean; // According to selected project in LeftNavBar  we must change showingTasks
  isPersonalProjectSelected: boolean; // According to this in LeftNavBar we must change showingTasks
  isAllTasksSelected: boolean; // According to this in LeftNavBar we must change showingTasks
  editingTask: GeneralTaskDTO = null; // Every edited task in inspector must be updated in ToDoComponent as well
  addingTaskFromHeader: GeneralTaskDTO;
  editingRunningTask: GeneralTaskDTO = null;
  editingRunningTaskIsStopping: boolean;
  addingRunningTask: GeneralTaskDTO = null;
  isEditingStatusTitle: boolean[] = [];
  taskNumber: number;
  domainName: string = DomainName;
  allStatuses: StatusDTO[] = [];
  statuses: StatusDTO[] = [];
  showingStatuses: StatusDTO[] = [];  // According to selected project and selected team we must change showingStatuses
  dropLists = new Map<number, Array<GeneralTaskDTO>>(); // Tasks based on statusIds i.e {statusId23->[task1,task2],statusId58->[task10]}
  allTasks: GeneralTaskDTO[] = []; // List of allTasks except archived tasks
  showingTasks: GeneralTaskDTO[] = []; // According to selected project and selected team we must change showingTasks
  runningTasks: GetRunningTasksResponseModel[] = [];
  followedTasks: GeneralTaskDTO[] = [];
  archivedTasks: GeneralTaskDTO[] = [];
  addTaskForm: FormGroup;
  addStatusForm: FormGroup;
  searchValue = ''; // The value will be searched in task titles, descriptions, checklist items, etc
  enabledFilters: BaseFilterModel[]; // List of enabled filters to be applied
  andOr = true; // For filtering tasks based on enabledFilters we must know weather to use "OR" or "And" for filter logic
  iterableDiffer;
  isListAnimationDisabled = false; // We must disable ListAnimation when changing Task Status Using drag and drop to avoid extra blink
  iconRotationDegree = TextDirectionController.iconRotationDegree;
  filterTaskPipe = new FilterPipe();
  activeNotificationTab = '';

  // TABLE STARTS
  onTableTitle: boolean[] = [];
  onTableDescription: boolean[] = [];

  onTableStatus: boolean[] = [];
  onTableStatusMenu: boolean[] = [];

  onTablePriority: boolean[] = [];
  onTablePriorityMenu: boolean[] = [];

  onTableMember: boolean[] = [];
  onTableMemberMenu: boolean[] = [];

  onTableProperty: boolean[] = [];
  onTablePropertyMenu: boolean[] = [];

  isEditingTaskTitle: boolean[] = [];
  isEditingTaskDescription: boolean[] = [];
  isRemovingChecklistItem: boolean[] = [];
  changeToInput: boolean[] = [];

  isHoveringStartDateForTask: number;
  isHoveringEndDateForTask: number;
  // TABLE ENDS


  // GANTT CHART STARTS
  draggingTask: RangeTask;
  ganttChartHeight: number;
  disableGanttAnimation = false;
  dayWidth = 65; // Based on px controlling absolute components width
  rangeTaskHeight = 32; // Based on px controlling absolute components height; put 8px for margin
  rangeTasks: RangeTask[] = [];
  todayDate = moment(new Date());
  currentDate = moment(new Date());
  currentMonthName: string;
  visibleDates: CalendarDay[] = [];
  calendarData: CalendarData;
  weekdays: Weekday[];
  dayAbbrs = [];
  projectColors = {};
  taskIsDraggable = {};
  timeLinesInfo = {};
  maximumOffset = 0;
  mouseLastPosition;
  mouseClickedPosition;
  isEditingStartTime = false;
  isEditingEndTime = false;
  beforeEditingTask: RangeTask;

  maxMinProjectOffsets = {};
  enteredDate: CalendarDay;
  hoveredProjectToAddTimeline = -1;
  onAddingRangeTasks: RangeTask[] = [];
  hoveredOnBarOffset = null;
  taskToAddtime;
  editingTimeOfTask = null;
  addingTimeline = false;

  // GANTT CHART ENDS

  private updateDayWidth() {
    let changed = false;
    const windowWidth = window.innerWidth;
    // screen size less than 2000 maps to 65px (13 * 5 === 400 * 5)
    if (Math.floor(windowWidth / 400) !== this.dayWidth / 13 && windowWidth >= 2000) {
      this.dayWidth = Math.floor(windowWidth / 400) * 13;
      changed = true;
    } else if (windowWidth <= 2000 && this.dayWidth !== 65) {
      this.dayWidth = 65;
      changed = true;
    }
    if (changed) {
      this.generateRangeTasks();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.target.toString().includes('HTMLBodyElement') && event.key === 'Delete' && this.selectedTask) {
      this.openDeleteDialog(this.selectedTask);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleArrowKeyboardEvent(event: KeyboardEvent) {
    // console.log(event.target.toString().includes('HTMLBodyElement'));
    if (event.target.toString().includes('HTMLBodyElement') && event.key === 'ArrowUp' && this.selectedTask) {
      if (this.toDoView === 'List' && this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr)
        .findIndex(t => t.id === this.selectedTask.id) - 1 >= 0) {
        this.mainWithInspectorService.changeMessage(this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr)
          [this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr)
          .findIndex(t => t.id === this.selectedTask.id) - 1]);
      }
      if (this.toDoView === 'Board' && this.filterTaskPipe
        .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
        .findIndex(t => t.id === this.selectedTask.id) - 1 >= 0) {
        this.mainWithInspectorService.changeMessage(
          this.filterTaskPipe
            .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
            [this.filterTaskPipe
            .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
            .findIndex(t => t.id === this.selectedTask.id) - 1]);
      }
    }

    if (event.target.toString().includes('HTMLBodyElement') && event.key === 'ArrowDown' && this.selectedTask) {
      if (this.toDoView === 'List' &&
        this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr).findIndex(t => t.id === this.selectedTask.id) + 1
        < this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr).length) {
        this.mainWithInspectorService.changeMessage(this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr)
          [this.filterTaskPipe.transform(this.showingTasks, this.enabledFilters, this.andOr)
          .findIndex(t => t.id === this.selectedTask.id) + 1]);
      }
      if (this.toDoView === 'Board' && this.filterTaskPipe
          .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
          .findIndex(t => t.id === this.selectedTask.id) + 1 <
        this.filterTaskPipe
          .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr).length) {
        this.mainWithInspectorService.changeMessage(
          this.filterTaskPipe
            .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
            [this.filterTaskPipe
            .transform(this.dropLists.get(this.selectedTask.statusId), this.enabledFilters, this.andOr)
            .findIndex(t => t.id === this.selectedTask.id) + 1]);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.columnHeight = event.target.innerHeight;
    this.ganttChartHeight = event.target.innerHeight;
    this.updateDayWidth();
  }

  // Unselect selectedTask by esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.unselectSelectedTask();
  }

  @HostListener('document:mousedown', ['$event'])
  addTimeline(e) {
    if (this.taskToAddtime && this.taskToAddtime.id !== this.editingTimeOfTask) {
      this.mouseLastPosition = e;
      this.mouseClickedPosition = e;
      this.taskToAddtime.startDate = this.enteredDate.momentDate.local().startOf('day').toDate();
      this.taskToAddtime.endDate = this.enteredDate.momentDate.local().startOf('day').toDate();
      this.onAddingRangeTasks.push(this.generateRangeTask(this.taskToAddtime));
      this.addingTimeline = true;
      this.isEditingStartTime = true;
      this.isEditingEndTime = false;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUpHandler(e) {
    if (this.draggingTask) {

      if (this.isEditingEndTime && !this.isEditingStartTime) {
        this.kanbanService.editTaskEndDate(
          this.draggingTask.task.id, moment.utc(this.draggingTask.task.endDate).format('YYYY-MM-DDTHH:mm:ss')
        ).subscribe(res => {
        });
      } else if (this.isEditingStartTime && !this.isEditingEndTime) {
        this.kanbanService.editTaskStartDate(
          this.draggingTask.task.id, moment.utc(this.draggingTask.task.startDate).format('YYYY-MM-DDTHH:mm:ss')
        ).subscribe(res => {
        });
      } else if (this.isEditingStartTime && this.isEditingEndTime) {
        let tempTask = {...this.draggingTask.task};

        if (moment(this.beforeEditingTask.task.endDate).toDate() < moment(tempTask.endDate).toDate()) {
          this.kanbanService.editTaskEndDate(
            tempTask.id, moment.utc(tempTask.endDate).format('YYYY-MM-DDTHH:mm:ss')
          ).subscribe(res => {
            this.kanbanService.editTaskStartDate(
              tempTask.id, moment.utc(tempTask.startDate).format('YYYY-MM-DDTHH:mm:ss')
            ).subscribe(res => {
            });
          });
        } else {
          this.kanbanService.editTaskStartDate(
            tempTask.id, moment.utc(tempTask.startDate).format('YYYY-MM-DDTHH:mm:ss')
          ).subscribe(res => {
            this.kanbanService.editTaskEndDate(
              tempTask.id, moment.utc(tempTask.endDate).format('YYYY-MM-DDTHH:mm:ss')
            ).subscribe(res => {
            });
          });
        }
      }

      this.draggingTask = null;
      this.beforeEditingTask = null;
      this.isEditingStartTime = false;
      this.isEditingEndTime = false;
      this.mouseLastPosition = null;
      this.mouseClickedPosition = null;
    } else if (this.taskToAddtime) {
      this.editingTimeOfTask = this.taskToAddtime.id;
      const tempTask = {...this.taskToAddtime};
      this.kanbanService.editTaskStartDate(
        tempTask.id, moment.utc(tempTask.startDate).format('YYYY-MM-DDTHH:mm:ss')
      ).subscribe(res => {
        this.kanbanService.editTaskEndDate(
          tempTask.id, moment.utc(tempTask.endDate).format('YYYY-MM-DDTHH:mm:ss')
        ).subscribe(res => {
          this.editingTimeOfTask = null;
        });
      });

      this.onAddingRangeTasks = [];
      this.rangeTasks.push(this.generateRangeTask(tempTask));
      this.taskToAddtime = null;
      this.isEditingStartTime = false;
      this.isEditingEndTime = false;
      this.mouseLastPosition = null;
      this.mouseClickedPosition = null;
      this.addingTimeline = false;
      this.updateLeftPanel();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMoveHandler(e) {
    if ((this.draggingTask || this.taskToAddtime) && this.mouseLastPosition) {
      this.mouseLastPosition = e;
      let diffPx = this.mouseLastPosition.pageX - this.mouseClickedPosition.pageX;
      const handleDirection = this.iconRotationDegree === 180 ? -1 : 1;
      diffPx *= handleDirection;
      const daysToAdd = diffPx >= 0 ? Math.floor(diffPx / this.dayWidth) : Math.ceil(diffPx / this.dayWidth);

      if (daysToAdd !== 0) {
        if (this.draggingTask && this.isEditingEndTime
          && moment(this.draggingTask.task.endDate).add(daysToAdd, 'days').isSameOrAfter(this.draggingTask.task.startDate)) {
          this.mouseClickedPosition = e;
          this.draggingTask.task.endDate = new Date(moment(this.draggingTask.task.endDate).add(daysToAdd, 'days').toISOString());
          this.editRangeTask(this.draggingTask.task);
        }
        if (this.draggingTask && this.isEditingStartTime
          && moment(this.draggingTask.task.startDate).add(daysToAdd, 'days').isSameOrBefore(this.draggingTask.task.endDate)) {
          this.mouseClickedPosition = e;
          this.draggingTask.task.startDate = moment(this.draggingTask.task.startDate).add(daysToAdd, 'days').toDate();
          this.editRangeTask(this.draggingTask.task);
        }
        if (this.taskToAddtime && this.isEditingStartTime
          && moment(this.taskToAddtime.startDate).add(daysToAdd, 'days').isAfter(this.taskToAddtime.endDate)) {
          this.isEditingEndTime = true;
          this.isEditingStartTime = false;
        } else if (this.taskToAddtime && this.isEditingEndTime
          && moment(this.taskToAddtime.endDate).add(daysToAdd, 'days').isBefore(this.taskToAddtime.startDate)) {
          this.isEditingEndTime = false;
          this.isEditingStartTime = true;
        }
        if (this.taskToAddtime && this.isEditingEndTime
          && moment(this.taskToAddtime.endDate).add(daysToAdd, 'days').isSameOrAfter(this.taskToAddtime.startDate)) {
          this.mouseClickedPosition = e;
          this.taskToAddtime.endDate = new Date(moment(this.taskToAddtime.endDate).add(daysToAdd, 'days').toISOString());
          this.editRangeTask(this.taskToAddtime);
        }
        if (this.taskToAddtime && this.isEditingStartTime
          && moment(this.taskToAddtime.startDate).add(daysToAdd, 'days').isSameOrBefore(this.taskToAddtime.endDate)) {
          this.mouseClickedPosition = e;
          this.taskToAddtime.startDate = moment(this.taskToAddtime.startDate).add(daysToAdd, 'days').toDate();
          this.editRangeTask(this.taskToAddtime);
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      // console.log(params);
      if (params.isAllTasksSelected) {
        this.mainWithInspectorService.changeMessage(null);
        this.dataService.changeProjectTasks(null);
        this.dataService.changeTeamTasks(null);
        this.dataService.changeIsPersonalSelected(false);
        this.dataService.changeIsPersonalProjectsSelected(false);
        this.dataService.changeIsAllTasksSelected(true);
        localStorage.setItem(
          'kanbanSettings',
          JSON.stringify(new KanbanSettingsDTO(null, null, false, false, true))
        );
      }
      if (params.isPersonalSelected) {
        this.mainWithInspectorService.changeMessage(null);
        this.dataService.changeProjectTasks(null);
        this.dataService.changeTeamTasks(null);
        this.dataService.changeIsPersonalSelected(true);
        this.dataService.changeIsPersonalProjectsSelected(false);
        this.dataService.changeIsAllTasksSelected(false);
        localStorage.setItem(
          'kanbanSettings',
          JSON.stringify(new KanbanSettingsDTO(null, null, true, false, false))
        );
      }
      if (params.isPersonalProjectsSelected) {
        this.mainWithInspectorService.changeMessage(null);
        this.dataService.changeProjectTasks(null);
        this.dataService.changeTeamTasks(null);
        this.dataService.changeIsPersonalSelected(false);
        this.dataService.changeIsPersonalProjectsSelected(true);
        this.dataService.changeIsAllTasksSelected(false);
        localStorage.setItem(
          'kanbanSettings',
          JSON.stringify(new KanbanSettingsDTO(null, null, false, true, false))
        );
      }
      if (params.projectId) {
        this.mainWithInspectorService.changeMessage(null);
        this.dataService.changeProjectTasks({id: params.projectId} as ProjectDTO);
        this.dataService.changeTeamTasks(null);
        this.dataService.changeIsPersonalSelected(false);
        this.dataService.changeIsPersonalProjectsSelected(false);
        this.dataService.changeIsAllTasksSelected(false);
        localStorage.setItem(
          'kanbanSettings',
          JSON.stringify(new KanbanSettingsDTO({id: params.projectId} as ProjectDTO, null, false, false, false))
        );
      }
      if (params.teamId) {
        this.mainWithInspectorService.changeMessage(null);
        this.dataService.changeProjectTasks(null);
        this.dataService.changeTeamTasks({id: params.teamId} as TeamDTO);
        this.dataService.changeIsPersonalSelected(false);
        this.dataService.changeIsPersonalProjectsSelected(false);
        this.dataService.changeIsAllTasksSelected(false);
        localStorage.setItem(
          'kanbanSettings',
          JSON.stringify(new KanbanSettingsDTO(null, {id: params.teamId} as TeamDTO, false, false, false))
        );
      }
      await this.router.navigate([], {queryParams: []});
    });

    this.updateDayWidth();
    this.columnHeight = window.innerHeight;
    this.ganttChartHeight = window.innerHeight;

    this.dataService.currentGetTaskApisFinished.subscribe((message) => {
      this.getTaskApisFinished = message;
    });

    this.dataService.getOffsets.subscribe((data) => {
      if (data) {
        // this.maxMinProjectOffsets = {};
        this.timeLinesInfo = data.tasksInfo;
        this.generateRangeTasks();
        this.computeRangeOfProjects();
      }
    });

    // Updating today date each 86400000 ms.
    setTimeout(() => {
      this.todayDate = moment(new Date());
      this.fillGanttChartDays();
      setInterval(() => {
        this.fillGanttChartDays();
        this.todayDate = moment(new Date());
      }, 86400000);
    }, 86400000 - (this.todayDate.hours() * 3600000
      + this.todayDate.minutes() * 60000
      + this.todayDate.seconds() * 1000
      + this.todayDate.milliseconds()));

    this.dataService.currentTaskCreated.subscribe(task => {
      // console.log('hi bos add');
      if (!task) {
        return;
      } else {
        if (this.allTasks.find(t => t.id === task.id) || this.showingTasks.find(t => t.id === task.id)) {
          return;
        } else {
          this.dataService.changeAddingTask(task);
          // this.generateRangeTasks();
          // this.computeRangeOfProjects();
        }
      }
    });

    this.dataService.currentTaskUpdated.subscribe(hr => {
      const editingTask = this.allTasks.find(task => task.id === hr.id);
      // console.log(editingTask);
      if (!hr) {
        return;
      } else {
        if (hr.name === 'Title') {
          editingTask.title = hr.field;
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.title = hr.field;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.title = hr.field;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.title = hr.field;
            }
          });
        }
        if (hr.name === 'Description') {
          editingTask.description = hr.field;
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.description = hr.field;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.description = hr.field;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.description = hr.field;
            }
          });
        }
        if (hr.name === 'TaskPriorityId') {
          editingTask.priorityId = +hr.field;

          if (
            TextDirectionController.textDirection === 'rtl' &&
            localStorage.getItem('languageCode') === 'fa-IR'
          ) {
            if (+hr.field === 1) {
              editingTask.priorityTitle = 'پایین';
            } else if (+hr.field === 3) {
              editingTask.priorityTitle = 'متوسط';
            } else if (+hr.field === 5) {
              editingTask.priorityTitle = 'بالا';
            }
          } else {
            if (+hr.field === 1) {
              editingTask.priorityTitle = 'Low';
            } else if (+hr.field === 3) {
              editingTask.priorityTitle = 'Medium';
            } else if (+hr.field === 5) {
              editingTask.priorityTitle = 'High';
            }
          }
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.priorityId = +hr.field;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.priorityId = +hr.field;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.priorityId = +hr.field;
            }
          });
        }
        if (hr.name === 'Assignee') {
          editingTask.usersAssignedTo.forEach(user => {
            if (user.userId === hr.field) {
              const index = editingTask.usersAssignedTo.indexOf(user);
              editingTask.usersAssignedTo.splice(index, 1);
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.usersAssignedTo.forEach(user => {
                if (user.userId === hr.field) {
                  const index = task.usersAssignedTo.indexOf(user);
                  task.usersAssignedTo.splice(index, 1);
                }
              });
            }
          });
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.usersAssignedTo.forEach(user => {
                if (user.userId === hr.field) {
                  const index = task.usersAssignedTo.indexOf(user);
                  task.usersAssignedTo.splice(index, 1);
                }
              });
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.usersAssignedTo.forEach(user => {
                if (user.userId === hr.field) {
                  const index = task.usersAssignedTo.indexOf(user);
                  task.usersAssignedTo.splice(index, 1);
                }
              });
            }
          });
        }
        if (hr.name === 'StartDate') {
          const newDate = new Date(CalendarService.convertUtcToLocalTime(moment.utc(hr.field).toDate(), 'YYYY-MM-DDTHH:mm:ss'));
          editingTask.startDate = newDate;
          console.log(hr.field);
          console.log(newDate);
          console.log(new Date(hr.field));
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.startDate = newDate;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.startDate = newDate;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.startDate = newDate;
            }
          });
        }
        if (hr.name === 'EndDate') {
          const newDate = new Date(CalendarService.convertUtcToLocalTime(moment.utc(hr.field).toDate(), 'YYYY-MM-DDTHH:mm:ss'));
          editingTask.endDate = newDate;
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.endDate = newDate;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.endDate = newDate;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.endDate = newDate;
            }
          });
        }
        if (hr.name === 'IsUrgent') {
          editingTask.isUrgent = hr.field;
          this.showingTasks.forEach(task => {
            if (task.id === hr.id) {
              task.isUrgent = hr.field;
            }
          });
          this.dropLists.get(editingTask.statusId).forEach(task => {
            if (task.id === hr.id) {
              task.isUrgent = hr.field;
            }
          });
          this.allTasks.forEach(task => {
            if (task.id === hr.id) {
              task.isUrgent = hr.field;
            }
          });
        }
        if (hr.name === 'BoardManualEvenOrder') {
          const isAfter = hr.field > editingTask.boardManualEvenOrder;
          editingTask.boardManualEvenOrder = hr.field;
          let x = this.dropLists.get(editingTask.statusId).findIndex(taskItem => taskItem.boardManualEvenOrder === hr.field + 1);
          // the following line must not have +1, because the order will be modified later
          editingTask.boardManualEvenOrder = hr.field;
          // editingTask.boardManualEvenOrder = item.order + 1;
          this.dropLists.set(editingTask.statusId, this.dropLists.get(editingTask.statusId).filter(taskItem => taskItem.id !== hr.id));
          if (isAfter) {
            this.dropLists.get(editingTask.statusId).splice(x + 1, 0, editingTask);
          } else {
            this.dropLists.get(editingTask.statusId).splice(x, 0, editingTask);
          }

          let i = 2;
          for (const ta of this.dropLists.get(editingTask.statusId).reverse()) {
            ta.boardManualEvenOrder = i;
            this.allTasks.find((t) => t.id === ta.id).boardManualEvenOrder = i;
            i += 2;
          }
        }
        // if (hr.name === 'TaskStatusId') {
        //
        // }
      }
    });

    this.dataService.currentCheckListItemCreated.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        this.allTasks.forEach(task => {
          if (task.id === item.taskId) {
            if (task.checkListItems.find(checkListItem => checkListItem.id === item.id)) {
              return;
            } else {
              task.checkListItems.push(item);
            }
          }
        });
      }
    });

    this.dataService.currentCheckListItemUpdated.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.checkListItems.forEach(checkListItem => {
          if (checkListItem.id === item.id) {
            checkListItem.title = item.title;
            checkListItem.isChecked = item.isChecked;
          }
        });
        this.allTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.id) {
                checkListItem.title = item.title;
                checkListItem.isChecked = item.isChecked;
              }
            });
          }
        });
        this.showingTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.id) {
                checkListItem.title = item.title;
                checkListItem.isChecked = item.isChecked;
              }
            });
          }
        });
        this.dropLists.get(editingTask.statusId).forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.id) {
                checkListItem.title = item.title;
                checkListItem.isChecked = item.isChecked;
              }
            });
          }
        });
      }
    });

    this.dataService.currentCheckListItemDeleted.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.checkListItems.forEach(checkListItem => {
          if (checkListItem.id === item.id) {
            const index = editingTask.checkListItems.indexOf(checkListItem);
            editingTask.checkListItems.splice(index, 1);
          }
        });
        this.allTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.checklistItemId) {
                const index = task.checkListItems.indexOf(checkListItem);
                task.checkListItems.splice(index, 1);
              }
            });
          }
        });
        this.showingTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.checklistItemId) {
                const index = task.checkListItems.indexOf(checkListItem);
                task.checkListItems.splice(index, 1);
              }
            });
          }
        });
        this.dropLists.get(editingTask.statusId).forEach(task => {
          if (task.id === item.taskId) {
            task.checkListItems.forEach(checkListItem => {
              if (checkListItem.id === item.checklistItemId) {
                const index = task.checkListItems.indexOf(checkListItem);
                task.checkListItems.splice(index, 1);
              }
            });
          }
        });
      }
    });

    this.dataService.currentTaskAssigneesAdded.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.id);
      if (!item) {
        return;
      } else {
        item.successAssigns.forEach(assignee => {
          if (editingTask.usersAssignedTo.find(assigneeItem => assigneeItem.userId === assignee.userId)) {
            return;
          } else {
            editingTask.usersAssignedTo.push(assignee);
          }
          // editingTask.usersAssignedTo.push(assignee);
        });
      }
    });

    this.dataService.currentTaskAttachmentAdded.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        item.attachments.forEach(attachment => {
          if (editingTask.attachments.find(attachmentItem => attachmentItem.fileContainerGuid === attachment.fileContainerGuid)) {
            return;
          } else {
            editingTask.attachments.push(attachment);
          }
        });
      }
    });

    this.dataService.currentTaskAttachmentDeleted.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.attachments.forEach(attachment => {
          if (attachment.fileContainerGuid === item.fileContainerGuid) {
            const index = editingTask.attachments.indexOf(attachment);
            editingTask.attachments.splice(index, 1);
          }
        });
        this.allTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.attachments.forEach(attachment => {
              if (attachment.fileContainerGuid === item.fileContainerGuid) {
                const index = task.attachments.indexOf(attachment);
                task.attachments.splice(index, 1);
              }
            });
          }
        });
        this.showingTasks.forEach(task => {
          if (task.id === item.taskId) {
            task.attachments.forEach(attachment => {
              if (attachment.fileContainerGuid === item.fileContainerGuid) {
                const index = task.attachments.indexOf(attachment);
                task.attachments.splice(index, 1);
              }
            });
          }
        });
        this.dropLists.get(editingTask.statusId).forEach(task => {
          if (task.id === item.taskId) {
            task.attachments.forEach(attachment => {
              if (attachment.fileContainerGuid === item.fileContainerGuid) {
                const index = task.attachments.indexOf(attachment);
                task.attachments.splice(index, 1);
              }
            });
          }
        });
      }
    });

    this.dataService.currentTaskDeleted.subscribe(id => {
      const editingTask = this.allTasks.find(task => task.id === id);
      if (!id) {
        return;
      } else {
        this.allTasks.forEach(task => {
          if (task.id === id) {
            const index = this.allTasks.indexOf(task);
            this.allTasks.splice(index, 1);
          }
        });
        this.showingTasks.forEach(task => {
          if (task.id === id) {
            const index = this.showingTasks.indexOf(task);
            this.showingTasks.splice(index, 1);
          }
        });
        this.dropLists.get(editingTask.statusId).forEach(task => {
          if (task.id === id) {
            const index = this.dropLists.get(editingTask.statusId).indexOf(task);
            this.dropLists.get(editingTask.statusId).splice(index, 1);
          }
        });
        if (this.selectedTask.id === id) {
          this.mainWithInspectorService.changeMessage(null);
        }
      }
    });

    this.dataService.currentTaskEstimationAdded.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.estimations.push(new EstimationDTO(item.estimationInMinutes, item.user));
      }
    });

    this.dataService.currentTaskEstimationUpdated.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.estimations.forEach(estimation => {
          if (estimation.user.userId === item.userId) {
            estimation.estimationTimeInMinute = item.estimationInMinutes;
          }
        });
      }
    });

    this.dataService.currentTaskEstimationDeleted.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.taskId);
      if (!item) {
        return;
      } else {
        editingTask.estimations.forEach(estimation => {
          if (estimation.user.userId === item.userId) {
            const index = editingTask.estimations.indexOf(estimation);
            editingTask.estimations.splice(index, 1);
          }
        });
      }
    });

    this.dataService.currentTaskStatusUpdated.subscribe(item => {
      const editingTask = this.allTasks.find(task => task.id === item.id);
      if (!item || !editingTask) {
        return;
      } else {
        for (const task of this.dropLists.get(editingTask.statusId)) {
          if (task.id === item.id) {
            // console.log('task : ', task);
            const index = this.dropLists.get(editingTask.statusId).indexOf(task);
            this.dropLists.get(editingTask.statusId).splice(index, 1);
            if (this.dropLists.get(item.taskStatusId).length === 0) {
              task.boardManualEvenOrder = 2;
              this.dropLists.set(item.taskStatusId, [...this.dropLists.get(item.taskStatusId), task]);
            } else {
              let x = this.dropLists.get(item.taskStatusId).findIndex(taskItem => taskItem.boardManualEvenOrder === item.order + 1);
              // the following line must not have +1, because the order will be modified later
              task.boardManualEvenOrder = item.order;
              editingTask.boardManualEvenOrder = item.order + 1;
              this.dropLists.get(item.taskStatusId).splice(x + 1, 0, task);
              // code here ...
              console.log('index', x);

            }

            // modify the source list orders
            let i = 2;
            for (const ta of this.dropLists.get(editingTask.statusId).reverse()) {
              ta.boardManualEvenOrder = i;
              this.allTasks.find((t) => t.id === ta.id).boardManualEvenOrder = i;
              i += 2;
            }

            // modify destination tasks order
            let j = 2;
            for (const ta of this.dropLists.get(item.taskStatusId).reverse()) {
              ta.boardManualEvenOrder = j;
              this.allTasks.find((t) => t.id === ta.id).boardManualEvenOrder = j;
              j += 2;
            }
          }
        }
        // this.dropLists.get(editingTask.statusId).forEach(task => {
        // });
        this.allTasks.forEach(task => {
          if (task.id === item.id) {
            task.statusId = item.taskStatusId;
            task.statusTitle = this.allStatuses.find(status => status.id === item.taskStatusId).title;
          }
        });
        this.showingTasks.forEach(task => {
          if (task.id === item.id) {
            task.statusId = item.taskStatusId;
            task.statusTitle = this.allStatuses.find(status => status.id === item.taskStatusId).title;
          }
        });
      }
    });

    this.dataService.currentIsAscending.subscribe((message) => {
      this.isAscending = message;
    });

    this.dataService.currentSortName.subscribe((message) => {
      this.sortName = message;
    });

    this.dataService.currentAndOr.subscribe((message) => {
      this.andOr = message;
    });

    this.dataService.currentEnabledFilters.subscribe((message) => {
      this.enabledFilters = message;
    });

    this.dataService.currentSearchedTask.subscribe((message) => {
      this.searchValue = message;
    });

    this.dataService.currentMessage.subscribe((message) => {
      this.toDoView = message;
    });

    this.mainWithInspectorService.currenttask.subscribe((message) => {
      this.selectedTask = message;
      if (message != null) {
        this.statuses = [];
        // this.getStatuses();
        if (this.selectedTask.projectId != null) {
          this.allStatuses.forEach(s => {
            if (s.projectId === this.selectedTask.projectId) {
              this.statuses.push(s);
            }
          });
        } else if (this.selectedTask.teamId != null) {
          this.allStatuses.forEach(s => {
            if (s.teamId === this.selectedTask.teamId) {
              this.statuses.push(s);
            }
          });
        } else if (this.selectedTask.teamId == null && this.selectedTask.projectId == null) {
          // handle personal tasks
          this.allStatuses.forEach(s => {
            if (s.userProfileId != null) {
              this.statuses.push(s);
            }
          });
        }
      }

    });

    this.mainWithInspectorService.currentEditingTaskFromInspector.subscribe((message) => {
      if (message == null) {
        return;
      }
      this.editingTask = message;

      let keyIndex = 0;
      for (const [statusId, tasks] of this.dropLists) {
        if (tasks.findIndex((t) => t.id === this.editingTask.id) !== -1) {
          keyIndex = tasks.findIndex((t) => t.id === this.editingTask.id);
        }
      }
      const i = this.showingTasks.findIndex((t) => t.id === message.id);


      // Remove the old task and replace it with the new one in dropLists.
      this.dropLists.set(this.selectedTask.statusId, this.dropLists.get(this.selectedTask.statusId)
        .filter((t) => t.id !== this.editingTask.id));


      if (this.selectedTask.statusId !== message.statusId) {
        console.log('first', this.dropLists.get(this.editingTask.statusId)[0]);
        this.selectedTask.boardManualEvenOrder = this.dropLists.get(
          this.editingTask.statusId)[0] ? this.dropLists.get(this.editingTask.statusId)[0].boardManualEvenOrder + 2 : 2;
        this.editingTask.boardManualEvenOrder = this.dropLists.get(
          this.editingTask.statusId)[0] ? this.dropLists.get(this.editingTask.statusId)[0].boardManualEvenOrder + 2 : 2;
        // console.log('hiiiiiiii',this.selectedTask.boardManualEvenOrder);
      }

      // Remove the old task and replace it with the new one in dropLists.
      if (this.dropLists.get(+this.editingTask.statusId).findIndex((t) => t.id === this.editingTask.id) === -1) {
        this.dropLists.get(+this.editingTask.statusId).splice(keyIndex, 0, this.editingTask);

      }

      // Remove the old task and replace it with the new one in showingTasks.
      this.showingTasks = this.showingTasks.filter((t) => t.id !== this.editingTask.id);
      this.showingTasks.splice(i, 0, this.editingTask);

      this.selectedTask.statusId = message.statusId;
      this.selectedTask.statusTitle = message.statusTitle;
      this.selectedTask.modifiedOn = new Date();
      this.mainWithInspectorService.changeMessage(this.selectedTask);

    });

    this.mainWithInspectorService.currentEditingTask.subscribe((message) => {
      // console.log('message');
      // console.log(message);
      if (message == null) {
        return;
      }
      message.modifiedOn = new Date();
      // message.modifiedOn = new Date(CalendarService.convertUtcToLocalTime(message.modifiedOn, 'YYYY-MM-DDTHH:mm:ss'));

      // We must remove the task from the showingTasks if the team or project is changed.
      let teamOrProjectChangedTask: GeneralTaskDTO = null;
      this.showingTasks.forEach((showingTask) => {
        if (
          showingTask.id === message.id &&
          (showingTask.teamId !== message.teamId ||
            showingTask.projectId !== message.projectId)
        ) {
          teamOrProjectChangedTask = showingTask;
        }
      });
      if (teamOrProjectChangedTask != null) {
        // this.mainWithInspectorService.changeMessage(null);
        // console.log('meesage');
        // console.log(message);
        // console.log('previous');
        // console.log(teamOrProjectChangedTask);
        if (this.isAllTasksSelected) {
          const index = this.showingTasks.findIndex((t) => t.id === message.id);
          this.showingTasks = this.showingTasks.filter(
            (t) => t.id !== message.id
          );
          this.showingTasks.splice(index, 0, message);
        } else {
          this.showingTasks = this.showingTasks.filter(
            (t) => t.id !== message.id
          );
        }
        // console.log(this.dropLists.get(message.statusId));
        this.dropLists.set(
          teamOrProjectChangedTask.statusId,
          this.dropLists
            .get(teamOrProjectChangedTask.statusId)
            .filter((t) => t.id !== teamOrProjectChangedTask.id)
        );
        this.dropLists.get(message.statusId).splice(0, 0, message);
        // this.dropLists.set(message.statusId, this.dropLists.get(message.statusId).splice(0, 0, message));
        // console.log(this.dropLists.get(message.statusId));
        // console.log('hi');
        this.allTasks = this.allTasks.filter(
          (t) => t.id !== teamOrProjectChangedTask.id
        );
        this.allTasks.splice(0, 0, message);
        teamOrProjectChangedTask = message;
        return;
      }

      // We must find the editingTask in the showingTasks and dropLists to update it.
      this.editingTask = message;
      // console.log('editingTask');
      // console.log(this.editingTask);
      let keyIndex = 0;
      for (const [statusId, tasks] of this.dropLists) {
        if (tasks.findIndex((t) => t.id === this.editingTask.id) !== -1) {
          keyIndex = tasks.findIndex((t) => t.id === this.editingTask.id);
        }
      }
      const i = this.showingTasks.findIndex((t) => t.id === message.id);


      // Remove the old task and replace it with the new one in dropLists.
      this.dropLists.set(this.selectedTask.statusId, this.dropLists.get(this.selectedTask.statusId)
        .filter((t) => t.id !== this.editingTask.id));

      // If task status is changed from inspector, we must add it to the end and modify the order
      // Remove the following code if problem happened in manual sort
      // if (this.selectedTask.statusId !== this.editingTask.statusId) {
      //   this.editingTask.boardManualEvenOrder = this.dropLists.get(this.editingTask.statusId)[0] ?
      //     this.dropLists.get(this.editingTask.statusId)[0].boardManualEvenOrder + 2 : 2;
      // }

      // Remove the old task and replace it with the new one in dropLists.
      if (this.dropLists.get(+this.editingTask.statusId).findIndex((t) => t.id === this.editingTask.id) === -1) {
        this.dropLists.get(+this.editingTask.statusId).splice(keyIndex, 0, this.editingTask);


      }


      // Remove the old task and replace it with the new one in showingTasks.
      this.showingTasks = this.showingTasks.filter((t) => t.id !== this.editingTask.id);
      this.showingTasks.splice(i, 0, this.editingTask);

      // if the task is directly updated from board or list(not from inspector), we must update the following properties of tasks.
      this.selectedTask.statusId = message.statusId;
      this.selectedTask.statusTitle = message.statusTitle;
      this.selectedTask.isUrgent = message.isUrgent;
      this.selectedTask.boardManualEvenOrder = message.boardManualEvenOrder;
      this.selectedTask.modifiedOn = new Date();


      this.mainWithInspectorService.changeMessage(this.selectedTask);
      this.editRangeTask(message);
    });

    this.mainWithInspectorService.currentRunningEditingTask.subscribe(
      (message) => {
        if (message == null) {
          return;
        }
        let removingFromRunning: number = null;
        this.editingRunningTask = message;
        this.runningTasks.forEach((rt) => {
          if (rt.taskId === message.id && !this.editingRunningTaskIsStopping) {
            rt.isPaused = !rt.isPaused;
          } else if (
            rt.taskId === message.id &&
            this.editingRunningTaskIsStopping
          ) {
            removingFromRunning = rt.taskId;
          }
        });
        if (removingFromRunning !== null) {
          this.runningTasks = this.runningTasks.filter(
            (rt) => rt.taskId !== removingFromRunning
          );
        }
        this.mainWithInspectorService.changeEditingRunningTaskIsStopping(false);
      }
    );

    this.mainWithInspectorService.currentRunningTaskIsStoppingSource.subscribe(
      (message) => {
        if (message == null) {
          return;
        }
        this.editingRunningTaskIsStopping = message;
      }
    );

    this.dataService.currentTaskNumber.subscribe((message) => {
      this.taskNumber = message;
    });

    this.mainWithInspectorService.currentAddingRunningTask.subscribe(
      (message) => {
        if (message == null) {
          return;
        }
        this.addingRunningTask = message;
      }
    );

    this.dataService.currentTaskNumber.subscribe((message) => {
      this.taskNumber = message;
    });

    this.mainWithInspectorService.currentAllStatuses.subscribe(message => {
      this.allStatuses = message;
    });

    this.dataService.currentTeamTasks.subscribe((message) => {
      if (message == null) {
        // this.showingTasks = [];
        // this.allTasks = [];
        // this.getTasks();
        this.selectedTeam = message;
        return;
      }
      this.showingTasks = [];
      this.selectedTeam = message;
      this.allTasks.forEach((task) => {
        // tslint:disable-next-line:triple-equals
        if (this.selectedTeam != null && !task.projectId && task.teamId == this.selectedTeam.id) {
          this.showingTasks.push(task);
        }
      });
      this.dataService.changeTaskNumber(this.showingTasks.length);
      if (this.selectedTeam != null) {
        // console.log('Selected team is : ' + this.selectedTeam.id);
        // this.kanbanService
        //   .getStatuses(this.selectedTeam.id, null)
        //   .subscribe((res) => {
        //     this.showingStatuses = [];
        //     res.value.forEach((element) => {
        //       this.showingStatuses.push(element);
        //     });
        //   });
        this.showingStatuses = [];
        this.allStatuses.forEach(s => {
          // tslint:disable-next-line:triple-equals
          if (s.teamId != null && s.teamId == this.selectedTeam.id) {
            this.showingStatuses.push(s);
          }
        });

      }
    });

    this.dataService.currentProjectTasks.subscribe((message) => {
      console.log(message);
      if (message == null) {
        // this.allTasks = [];
        // // this.showingTasks = [];
        // this.getTasks();
        this.selectedProject = message;
        return;
      }
      this.showingTasks = [];
      this.selectedProject = message;
      this.allTasks.forEach((task) => {
        if (
          this.selectedProject != null &&
          // tslint:disable-next-line:triple-equals
          task.projectId == this.selectedProject.id
        ) {
          this.showingTasks.push(task);
        }
      });
      this.dataService.changeTaskNumber(this.showingTasks.length);
      if (this.selectedProject != null) {
        // this.showingStatuses = [];
        // console.log('Selected project is: ' + this.selectedProject.id);
        // this.kanbanService
        //   .getStatuses(null, this.selectedProject.id)
        //   .subscribe((res) => {
        //     this.showingStatuses = [];
        //     res.value.forEach((element) => {
        //       this.showingStatuses.push(element);
        //     });
        //   });
        this.showingStatuses = [];
        // console.log('selectedProject.id = ' + this.selectedProject.id);
        this.allStatuses.forEach(s => {
          // console.log('s.id = ' + s.projectId);
          // tslint:disable-next-line:triple-equals
          if (s.projectId != null && s.projectId == this.selectedProject.id) {
            this.showingStatuses.push(s);
          }
        });
      }
    });

    this.dataService.currentIsPersonalSelected.subscribe((message) => {
      if (message == null || message === false) {
        if (message === false) {
          this.showingTasks = [];
        }
        // this.allTasks = [];
        // this.showingTasks = [];
        // this.getTasks();
        this.isPersonalSelected = message;
        return;
      }
      this.showingTasks = [];
      this.isPersonalSelected = message;
      this.allTasks.forEach((task) => {
        if (
          this.isPersonalSelected &&
          task.projectId == null &&
          task.teamId == null
        ) {
          this.showingTasks.push(task);
        }
      });
      this.dataService.changeTaskNumber(this.showingTasks.length);
      if (this.isPersonalSelected) {
        // this.kanbanService.getStatuses(null, null).subscribe((res) => {
        //   this.showingStatuses = [];
        //   res.value.forEach((element) => {
        //     this.showingStatuses.push(element);
        //   });
        // });
        this.showingStatuses = [];
        this.allStatuses.forEach(s => {
          if (s.userProfileId != null) {
            this.showingStatuses.push(s);
          }
        });
      }
    });

    this.dataService.currentIsPersonalProjectSelected.subscribe((message) => {
      if (message == null || message === false) {
        if (message === false) {
          this.showingTasks = [];
        }
        // this.allTasks = [];
        // this.getTasks();
        this.isPersonalProjectSelected = message;
        return;
      }
      this.showingTasks = [];
      this.isPersonalProjectSelected = message;
      this.allTasks.forEach((task) => {
        if (
          this.isPersonalProjectSelected &&
          task.projectId != null &&
          task.teamId == null
        ) {
          this.showingTasks.push(task);
        }
      });
      this.dataService.changeTaskNumber(this.showingTasks.length);
      if (this.isPersonalSelected) {
        // this.kanbanService.getStatuses(null, null).subscribe((res) => {
        //   this.showingStatuses = [];
        //   res.value.forEach((element) => {
        //     this.showingStatuses.push(element);
        //   });
        // });
        this.showingStatuses = [];
        this.allStatuses.forEach(s => {
          if (s.projectId != null && s.projectId === this.selectedProject.id) {
            this.showingStatuses.push(s);
          }
        });
      }
    });

    this.dataService.currentIsAllTasksSelected.subscribe((message) => {
      if (message == null || message === false) {
        if (message === false) {
          this.showingTasks = [];
        }
        this.isAllTasksSelected = message;
        return;
      }
      this.showingTasks = [];
      this.isAllTasksSelected = message;
      this.allTasks.forEach((task) => {
        if (this.isAllTasksSelected) {
          this.showingTasks.push(task);
        }
      });
      this.dataService.changeTaskNumber(this.showingTasks.length);
      if (this.isAllTasksSelected) {
        this.showingStatuses = [];
      }
    });

    this.dataService.currentAddingTask.subscribe((message) => {
      // if (this.showingTasks.some(t => t.id === message.id)) {
      //   return;
      // }
      this.addingTaskFromHeader = message;
      if (message == null) {
        return;
      }

      // The following if means the task response has arrived from server.
      if (this.allTasks.some(t => t.guid === message.title && t.id === -1)) {
        // let realTask: GeneralTaskDTO;
        // this.allTasks.forEach(task => {
        //   if (task.guid === message.title) {
        //     realTask = task;
        //   }
        // });
        // realTask = message;
        this.dropLists.set(message.statusId, this.dropLists.get(message.statusId).filter(tt => tt.guid !== message.title));
        this.allTasks = this.allTasks.filter(tt => tt.guid !== message.title);
        this.showingTasks = this.showingTasks.filter(tt => tt.guid !== message.title);
      }
      this.allTasks.splice(0, 0, message);
      this.dropLists.get(message.statusId).splice(0, 0, message);

      // When you create a task, It must be already followed
      this.followedTasks.push(message);

      try {
        if (
          this.isAllTasksSelected ||
          (this.isPersonalSelected &&
            message.projectId == null &&
            message.teamId == null) ||
          (message.projectId != null &&
            message.teamId == null &&
            this.isPersonalProjectSelected) ||
          (this.selectedTeam != null &&
            message.teamId != null &&
            this.selectedTeam.id === message.teamId) ||
          (this.selectedProject != null &&
            message.projectId != null &&
            message.projectId === this.selectedProject.id)
        ) {
          this.showingTasks.splice(0, 0, message);
        }
      } catch (e) {
      }
      this.dataService.changeAddingTask(null);
      this.updateLeftPanel();
    });

    this.dataService.currentActiveNotificationTab.subscribe((message) => {
      this.activeNotificationTab = message;
    });

    this.addTaskForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Description: new FormControl(null),
      StartDate: new FormControl(null),
      EndDate: new FormControl(null),
    });

    this.addStatusForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
    });

    this.getAllStatuses();

    this.getRunningTasks();

    this.getFollowedTasks();

    this.getArchivedTasks();
  }

  ngOnDestroy() {
    this.mainWithInspectorService.changeMessage(null);
    // console.log('bye bye dear');
  }

  updateLeftPanel() {
    const currentViewTasks: GeneralTaskDTO[] = this.allTasks.filter(
      task => task.startDate === null || task.endDate === null || (task.startDate && task.endDate &&
        (this.computeDatesDiff(task.startDate, this.visibleDates[this.visibleDates.length - 1].momentDate.toDate(), 'days') >= 0
          && this.computeDatesDiff(this.visibleDates[0].momentDate.toDate(), task.endDate, 'days') >= 0))
    );
    this.dataService.sendTasks(currentViewTasks);
  }

  checkMouseMoveOnGantt(e) {
    if (!this.addingTimeline && !this.draggingTask) {
      this.hoveredProjectToAddTimeline = -1;
      for (const projectId in this.maxMinProjectOffsets) {
        if (e.offsetY >= this.maxMinProjectOffsets[projectId].min && e.offsetY <= this.maxMinProjectOffsets[projectId].max) {
          this.hoveredProjectToAddTimeline = projectId === 'null' ? null : Number(projectId);
          break;
        }
      }
      if (this.hoveredProjectToAddTimeline !== -1) {
        const relatedTasks = this.allTasks.filter(task => task.projectId === this.hoveredProjectToAddTimeline);
        for (const task of relatedTasks) {
          if (task.id in this.timeLinesInfo &&
            e.offsetY >= this.timeLinesInfo[task.id].offset.bottom - 200 &&
            e.offsetY <= this.timeLinesInfo[task.id].offset.bottom - 200 + this.rangeTaskHeight &&
            this.hoveredOnBarOffset !== this.timeLinesInfo[task.id].offset.bottom - 204) {
            this.hoveredOnBarOffset = this.timeLinesInfo[task.id].offset.bottom - 204;
            if (!task.startDate || !task.endDate) {
              this.taskToAddtime = task;
            }
            break;
          }
        }
      } else if (e.target.className.includes('day')) {
        this.hoveredOnBarOffset = null;
        this.taskToAddtime = null;
      }
    }
  }

  computeRangeOfProjects() {
    this.maxMinProjectOffsets = {};
    for (const taskId in this.timeLinesInfo) {
      for (const task of this.allTasks) {
        if (task.id === Number(taskId)) {
          if (!this.maxMinProjectOffsets[task.projectId]) {
            this.maxMinProjectOffsets[task.projectId] = {
              max: this.timeLinesInfo[task.id].offset.bottom - 200 + this.rangeTaskHeight,
              min: this.timeLinesInfo[task.id].offset.bottom - 200
            };
          } else {
            this.maxMinProjectOffsets[task.projectId].max = Math.max(
              this.timeLinesInfo[task.id].offset.bottom - 200 + this.rangeTaskHeight,
              this.maxMinProjectOffsets[task.projectId].max
            );
            this.maxMinProjectOffsets[task.projectId].min = Math.min(
              this.timeLinesInfo[task.id].offset.bottom - 200,
              this.maxMinProjectOffsets[task.projectId].min
            );
          }
        }
      }
    }
  }

  addToCurrentDate(amount: number, unit) {
    this.currentDate = this.calendarService.addAmountToDate(this.currentDate, amount, unit);
    this.rangeTasks = [];
    this.fillGanttChartDays();
  }

  computeDatesDiff(firstDate: Date, secondDate: Date, unit) {
    return moment(secondDate).startOf('day').diff(moment(firstDate).startOf('day'), unit);
  }

  taskIsStartingInCurrentView(task: GeneralTaskDTO): boolean {
    return task.startDate >= this.visibleDates[0].momentDate.toDate();
  }

  taskIsEndingInCurrentView(task: GeneralTaskDTO): boolean {
    return task.endDate <= this.visibleDates[this.visibleDates.length - 1].momentDate.toDate();
  }

  addOrRemoveResizeCursor(e, rangeTask: RangeTask) {
    if (!this.draggingTask) {
      this.hoveredOnBarOffset = this.timeLinesInfo[rangeTask.task.id].offset.bottom - 204;
      if ((rangeTask.width - e.offsetX <= 5 || e.offsetX <= 5)
        && !e.target.className.includes('range-task-title')) {
        e.target.classList.add('drag-task-cursor');
      } else {
        e.target.classList.remove('drag-task-cursor');
      }
      this.taskIsDraggable[rangeTask.task.id] = true;
    }
  }

  taskMouseDown(e, rangeTask: RangeTask) {
    if (this.taskIsDraggable[rangeTask.task.id]) {
      this.draggingTask = rangeTask;
      this.beforeEditingTask = JSON.parse(JSON.stringify(this.draggingTask));
      this.mouseLastPosition = e;
      this.mouseClickedPosition = e;
      const offset = this.iconRotationDegree === 180 ? (rangeTask.width - e.offsetX) : e.offsetX;

      if (offset <= 5) {
        this.isEditingStartTime = true;
      } else if (rangeTask.width - offset <= 5) {
        this.isEditingEndTime = true;
      } else {
        this.isEditingStartTime = true;
        this.isEditingEndTime = true;
      }
    }
  }

  editRangeTask(task: GeneralTaskDTO) {
    const rangeTask = this.rangeTasks.filter(t => t.task.id === task.id);
    if (rangeTask.length && task.startDate && task.endDate) {
      const newRangeTask = this.generateRangeTask(rangeTask[0].task);
      for (const property in newRangeTask) {
        rangeTask[0][property] = newRangeTask[property];
      }
    }
    const addingTimeline = this.onAddingRangeTasks.filter(t => t.task.id === task.id);
    if (addingTimeline.length && task.startDate && task.endDate) {
      const newRangeTask = this.generateRangeTask(addingTimeline[0].task);
      for (let property in newRangeTask) {
        addingTimeline[0][property] = newRangeTask[property];
      }
    }
    if (!task.startDate || !task.endDate) {
      this.updateLeftPanel();
      this.generateRangeTasks();
    }
  }

  computeRangeTaskWidth(task: GeneralTaskDTO, isStarting: boolean, isEnding: boolean) {
    let width = this.computeDatesDiff(
      isStarting ? task.startDate : this.visibleDates[0].momentDate.toDate(),
      isEnding ? task.endDate : this.visibleDates[this.visibleDates.length - 1].momentDate.toDate(),
      'days');
    let res = 0;
    if (width > 0) {
      res += width * this.dayWidth + (!isStarting ? this.dayWidth / 2 + 5 : 0) + (!isEnding ? this.dayWidth / 2 + 5 : 0);
    } else if (width == 0) {
      res = !isStarting || !isEnding ? this.dayWidth / 2 + 5 : this.dayWidth;
    }
    return res;
  }

  computeRangeTaskOffsetX(task: GeneralTaskDTO) {
    let offsetX = this.computeDatesDiff(this.visibleDates[0].momentDate.toDate(), task.startDate, 'days');
    return offsetX >= 0 ? offsetX * this.dayWidth + this.dayWidth / 2 : -5;
  }

  generateRangeTask(task: GeneralTaskDTO) {
    let isStarting = this.taskIsStartingInCurrentView(task);
    let isEnding = this.taskIsEndingInCurrentView(task);
    return new RangeTask(
      true,
      isStarting,
      isEnding,
      '#' + this.timeLinesInfo[task.id].color,
      this.timeLinesInfo[task.id].offset.bottom - 200,
      this.computeRangeTaskOffsetX(task),
      this.computeRangeTaskWidth(task, isStarting, isEnding),
      task);
  }

  generateRangeTasks() {
    let currentViewTasks: GeneralTaskDTO[] = [];
    for (let taskId in this.timeLinesInfo) {
      for (let task of this.allTasks) {
        if (task.id == Number(taskId) && task.startDate && task.endDate) {
          currentViewTasks.push(task);
        }
      }
    }
    this.rangeTasks = [];
    for (let i = 0; i < currentViewTasks.length; i++) {
      this.rangeTasks.push(
        this.generateRangeTask(currentViewTasks[i])
      );
      this.taskIsDraggable[currentViewTasks[i].id] = false;
    }
  }

  fillGanttChartDays() {
    this.disableGanttAnimation = false;
    this.taskIsDraggable = {};
    this.calendarService
      .fillVisibleDates(this.currentDate, 'month')
      .then(async (visibleDates: CalendarDay[]) => {
        switch (this.calendarData.firstCalendar) {
          case CalendarTypeEnum.GEORGIAN:
            this.currentMonthName = await this.calendarService.getMonthName(this.currentDate.month());
            break;
          case CalendarTypeEnum.JALALI:
            this.currentMonthName = await this.calendarService.getJalaliMonthName(
              jmoment(this.currentDate.toDate()).jMonth()
            );
            break;
        }
        this.weekdays = await this.calendarService.getWeekdays();
        this.visibleDates = visibleDates;
        this.visibleDates = this.visibleDates.filter(day => day.hasMainStyle);
        this.visibleDates.forEach(day => {
          for (const weekday of this.weekdays) {
            if (weekday.defaultIndex === day.momentDate.day()) {
              this.dayAbbrs.push(weekday.abbr);
              break;
            }
          }
        });
        this.updateLeftPanel();
        setTimeout(() => {
          this.disableGanttAnimation = true;
        }, 10);
      });
  }

  getAllStatuses() {
    this.kanbanService.getAllStatuses().subscribe((res) => {
      this.allStatuses = [];
      res.forEach((element) => {
        this.allStatuses.push(element);
        this.dropLists.set(element.id, []);
      });

      this.mainWithInspectorService.changeAllStatuses(this.allStatuses);

      this.getTasks();
    });
  }

  getTasks() {
    if (localStorage.getItem('kanbanViewSettings') == null) {
      localStorage.setItem('kanbanViewSettings', 'List');
      this.dataService.changeMessage('List');
    } else {
      this.dataService.changeMessage(
        localStorage.getItem('kanbanViewSettings')
      );
    }
    this.kanbanService.getTasks().subscribe((res) => {
      if (res) {
        res.forEach((task) => {
          if (task.startDate) {
            task.startDate = new Date(CalendarService.convertUtcToLocalTime(task.startDate, 'YYYY-MM-DDTHH:mm:ss'));
          }
          if (task.endDate) {
            task.endDate = new Date(CalendarService.convertUtcToLocalTime(task.endDate, 'YYYY-MM-DDTHH:mm:ss'));
          }
          task.modifiedOn = new Date(CalendarService.convertUtcToLocalTime(task.modifiedOn, 'YYYY-MM-DDTHH:mm:ss'));
          this.dropLists.get(task.statusId).push(task);
        });
        // this.allTasks = res;
        // this.showingTasks = res;
        this.allTasks = res.map((x) => Object.assign({}, x));
        // this.showingTasks = res.map((x) => Object.assign({}, x));
        this.dataService.changeTaskNumber(this.allTasks.length);
        setTimeout(() => {
          this.showGetTasksLoading = false;
        }, 1000);
        this.dataService.changeGetTaskApisFinished(true);
        this.fillGanttChartDays();
        // this.showGetTasksLoading = false;
        // this.showingStatuses = [];
      }
    });
  }

  getArchivedTasks() {
    this.kanbanService.getArchivedTasks().subscribe((res) => {
      this.archivedTasks = res;
    });
  }

  getRunningTasks() {
    this.kanbanService.getRunningTasks().subscribe(
      (res) => {
        this.runningTasks = res;
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.getRunningTasksError').toPromise(),
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

  getFollowedTasks() {
    this.kanbanService.getFollowedTasks().subscribe(
      (res) => {
        this.followedTasks = res;
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.getFollowedTasksError').toPromise(),
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

  private isFollowed(taskId: number) {
    return this.followedTasks.some((t) => t.id === taskId);
  }

  followTask(task: GeneralTaskDTO) {
    this.kanbanService.followTask(task.id).subscribe(
      async (res) => {
        this.followedTasks.push(task);
        // console.log(this.runningTasks);
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.taskFollowed')
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
        // console.log(res);
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.followTaskError').toPromise(),
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

  unfollowTask(task: GeneralTaskDTO) {
    this.kanbanService.unfollowTask(task.id).subscribe(
      async (res) => {
        console.log(res);
        this.followedTasks = this.followedTasks.filter(f => f.id !== task.id);
        // console.log(this.runningTasks);
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.taskUnfollowed')
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
        // console.log(res);
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.unfollowTasksError').toPromise(),
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

  duplicateTask(task: GeneralTaskDTO) {
    this.kanbanService.duplicateTask(task.id).subscribe(
      async (res) => {
        this.dataService.changeAddingTask(res.value);
        this.mainWithInspectorService.changeMessage(res.value);
        // console.log(this.runningTasks);
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.taskDuplicated')
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
        // console.log(res);
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.duplicateTaskError').toPromise(),
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

  startTimeTracker(task: GeneralTaskDTO) {
    this.timeService.start(task.id).subscribe(
      async (res) => {
        if (this.runningTasks.find((t) => t.taskId === task.id)) {
          this.runningTasks.forEach((t) => {
            if (t.taskId === task.id) {
              t.isPaused = false;
            }
          });
        } else {
          const rt = new GetRunningTasksResponseModel(task.id, false);
          this.runningTasks.push(rt);
          this.mainWithInspectorService.changeAddingRunningTask(task);
        }
        // console.log(this.runningTasks);
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.timetrackStarted')
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
        // console.log(res);
      },
      async (error) => {
        this.snackbar.open(
          await this.translateService.get('Snackbar.startTimeTrackError').toPromise(),
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

  private isRunning(taskId) {
    return this.runningTasks.some((t) => t.taskId === taskId);
  }

  private isPaused(taskId) {
    return this.runningTasks.some(
      (t) => t.taskId === taskId && t.isPaused === true
    );
  }

  stopTimeTracker(task: GeneralTaskDTO) {
    this.timeService.stop(task.id).subscribe(
      async (res) => {
        this.runningTasks = this.runningTasks.filter(
          (t) => t.taskId !== task.id
        );
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.timetrackStopped')
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
        this.snackbar.open(
          await this.translateService.get('Snackbar.stopTimeTrackError').toPromise(),
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

  pauseTimeTracker(task: GeneralTaskDTO) {
    this.timeService.pause(task.id).subscribe(
      async (res) => {
        this.runningTasks.forEach((t) => {
          if (t.taskId === task.id) {
            t.isPaused = true;
          }
        });
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.timetrackPaused')
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
        this.snackbar.open(
          await this.translateService.get('Snackbar.pauseTimeTrackError').toPromise(),
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

  addStatus(newStatus: string) {
    this.kanbanService
      .addStatus(
        newStatus,
        this.selectedTeam != null ? this.selectedTeam.id : null,
        this.selectedProject != null ? this.selectedProject.id : null
      )
      .subscribe(
        async (res) => {
          this.allStatuses.push(res.value);

          this.mainWithInspectorService.changeAllStatuses(this.allStatuses);

          this.showingStatuses.push(res.value);
          this.dropLists.set(res.value.id, []);
          this.snackbar.open(
            await this.translateService
              .get('Snackbar.taskStatusCreated')
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
          this.snackbar.open(
            await this.translateService.get('Snackbar.addStatusError').toPromise(),
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

  deleteStatus(statusId: number) {
    this.kanbanService.deleteStatus(statusId).subscribe(
      async (res) => {
        this.showingStatuses = this.showingStatuses.filter((s) => s.id !== statusId);
        this.allStatuses = this.allStatuses.filter((s) => s.id !== statusId);

        this.mainWithInspectorService.changeAllStatuses(this.allStatuses);

        this.dropLists.delete(statusId);
        this.snackbar.open(
          await this.translateService.get('Snackbar.statusDeleted').toPromise(),
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
        this.snackbar.open(
          await this.translateService.get('Snackbar.deleteStatusError').toPromise(),
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

  deleteTask(task: GeneralTaskDTO) {
    this.kanbanService.deleteTask(task.id).subscribe(
      async (res) => {
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() - 1
        );
        this.mainWithInspectorService.changeMessage(null);
        this.showingTasks = this.showingTasks.filter((t) => t.id !== task.id);
        this.allTasks = this.allTasks.filter((t) => t.id !== task.id);
        this.updateLeftPanel();
        this.dropLists.set(
          task.statusId,
          this.dropLists.get(task.statusId).filter((t) => t.id !== task.id)
        );

        // Normalize the task's orders after delete
        let j = 2;
        for (const t of this.dropLists.get(task.statusId).reverse()) {
          t.boardManualEvenOrder = j;
          this.allTasks.find((ta) => ta.id === t.id).boardManualEvenOrder = j;
          j += 2;
        }
        // console.log(this.dropLists);
        this.snackbar.open(
          await this.translateService.get('Snackbar.taskDeleted').toPromise(),
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
        this.snackbar.open(
          await this.translateService.get('Snackbar.deleteTaskError').toPromise(),
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

  showInspector(id: string): GeneralTaskDTO {
    let selectedTask: GeneralTaskDTO;
    for (const task of this.allTasks) {
      if (task.guid === id) {
        selectedTask = task;
        console.log(selectedTask);
        this.mainWithInspectorService.changeMessage(task);
        return selectedTask;
      }
    }

    return null;
  }

  editTaskTitle(task: GeneralTaskDTO, newTaskTitle: string) {
    if (newTaskTitle === task.title || newTaskTitle === '') {
      return;
    }
    this.kanbanService.updateTitle(task.id, newTaskTitle).subscribe(
      async (res) => {
        task.title = newTaskTitle;
        this.snackbar.open(
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
        this.snackbar.open(
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

  editTaskDescription(task: GeneralTaskDTO, newTaskDescription: string) {
    if (newTaskDescription === task.description) {
      return;
    }
    this.kanbanService.updateDescription(task.id, newTaskDescription).subscribe(
      async (res) => {
        task.description = newTaskDescription;
        this.snackbar.open(
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
        this.snackbar.open(
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

  modifyChecklistItem(task: GeneralTaskDTO, event, item: ChecklistItemDTO) {
    // console.log(event.checked);
    this.kanbanService
      .updateCheckListItemIsChecked(item.id, event.checked)
      .subscribe(
        async (res) => {
          task.checkListItems.forEach((checklistItem) => {
            if (checklistItem.id === item.id) {
              checklistItem.isChecked = event.checked;
            }
          });
          this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this.snackbar.open(
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
          this.snackbar.open(
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

  addChecklistItem(task: GeneralTaskDTO, newChecklistItem: string) {
    const addingChecklistItem = new ChecklistItemPostDTO(
      newChecklistItem,
      false
    );
    if (newChecklistItem === '') {
      return;
    }
    this.kanbanService.addChecklistItem(task.id, addingChecklistItem).subscribe(
      async (res) => {
        task.checkListItems.push(res.value);
        this.snackbar.open(
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
        this.snackbar.open(
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
  }

  updateStatusTitle(
    statusId: number,
    newStatus: string,
    oldStatusName: string
  ) {
    if (newStatus === '' || newStatus === oldStatusName) {
      return;
    }
    this.kanbanService.updateStatusTitle(statusId, newStatus).subscribe(
      async (res) => {
        this.showingStatuses.forEach((s) => {
          if (s.id === statusId) {
            s.title = newStatus;
          }
        });
        this.allStatuses.forEach((s) => {
          if (s.id === statusId) {
            s.title = newStatus;
          }
        });

        this.mainWithInspectorService.changeAllStatuses(this.allStatuses);

        this.snackbar.open(
          res.message,
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
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.cantChangeStatusTitle')
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

  archiveTask(task: GeneralTaskDTO) {
    this.kanbanService.archiveTask(task.id).subscribe(
      async (res) => {
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() - 1
        );
        this.mainWithInspectorService.changeMessage(null);
        this.allTasks = this.allTasks.filter((t) => t.id !== task.id);
        this.showingTasks = this.showingTasks.filter((t) => t.id !== task.id);
        this.dropLists.set(
          task.statusId,
          this.dropLists.get(task.statusId).filter((t) => t.id !== task.id)
        );

        // Normalize the task's orders after delete
        let j = 2;
        for (const t of this.dropLists.get(task.statusId).reverse()) {
          t.boardManualEvenOrder = j;
          this.allTasks.find((ta) => ta.id === t.id).boardManualEvenOrder = j;
          j += 2;
        }
        this.snackbar.open(
          await this.translateService.get('Snackbar.taskArchived').toPromise(),
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
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.cantArchiveTask')
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

  archiveStatusTasks(statusId: number) {
    this.kanbanService.archiveStatusTasks(statusId).subscribe(
      async (res) => {
        const numberOfTasks = this.allTasks.length.valueOf();
        this.allTasks = this.allTasks.filter((t) => t.statusId !== statusId);
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() -
          this.dropLists.get(statusId).length
        );
        this.showingTasks = this.showingTasks.filter((t) => t.id !== statusId);
        this.dropLists.set(
          statusId,
          this.dropLists.get(statusId).filter((t) => t.statusId !== statusId)
        );

        this.snackbar.open(
          await this.translateService.get('Snackbar.tasksArchived').toPromise(),
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
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.cantArchiveTasks')
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

  updateUrgent(task: GeneralTaskDTO, isUrgent) {
    // const selectedTask: GeneralTaskDTO = {...this.selectedTask};
    this.kanbanService.updateUrgent(task.id, isUrgent).subscribe(
      async (res) => {
        // this.selectedTask = {...selectedTask};
        // if (selectedTask.id === this.selectedTask.id) {
        //   this.selectedTask.isUrgent = isUrgent;
        // }
        task.isUrgent = isUrgent;
        // this.selectedTask.isUrgent = isUrgent;
        this.mainWithInspectorService.changeEditingTask(task);
        // this.mainWithInspectorService.changeMessage(selectedTask);
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.taskUrgancyUpdated')
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
        this.snackbar.open(
          await this.translateService
            .get('Snackbar.cantUpdateTaskUrgency')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise(),
          {
            duration: 2000,
            direction:
              TextDirectionController.getTextDirection() === 'ltr'
                ? 'ltr'
                : 'rtl',
          }
        );
      }
    );
  }

  updatePriority(item, newPriority) {
    if (item.priorityId === newPriority) {
      return;
    }

    this.kanbanService
      .updatePriority(item.id, newPriority)
      .subscribe(
        async (res) => {
          if (
            TextDirectionController.textDirection === 'rtl' &&
            localStorage.getItem('languageCode') === 'fa-IR'
          ) {
            if (newPriority === 1) {
              item.priorityTitle = 'پایین';
            } else if (newPriority === 3) {
              item.priorityTitle = 'متوسط';
            } else if (newPriority === 5) {
              item.priorityTitle = 'بالا';
            }
          } else {
            if (newPriority === 1) {
              item.priorityTitle = 'Low';
            } else if (newPriority === 3) {
              item.priorityTitle = 'Medium';
            } else if (newPriority === 5) {
              item.priorityTitle = 'High';
            }
          }
          // this.selectedTask.priorityTitle =;
          item.priorityId = newPriority;
          // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this.snackbar.open(
            res.message,
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
          this.snackbar.open(
            await this.translateService.get('Snackbar.updatePriorityError').toPromise(),
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

  removeAssignee(item, userId: string) {
    this.kanbanService
      .deleteUserAssignedTo(item.id, userId)
      .subscribe(
        async (res) => {
          item.usersAssignedTo =
            item.usersAssignedTo.filter(
              (u) => u.userId !== userId
            );
          // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
          this.snackbar.open(
            res.message,
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
          this.snackbar.open(
            await this.translateService.get('Snackbar.removeAssigneeError').toPromise(),
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

  openDeleteDialog(task: GeneralTaskDTO) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteTask,
        itemName: task.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.deleteTask(task);
        }
      }
    });
  }

  openDeleteStatusDialog(status: StatusDTO) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.deleteStatus,
        itemName: status.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          this.deleteStatus(status.id);
        }
      }
    });
  }

  openArchiveStatusTasksDialog(status: StatusDTO) {
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.archive, ButtonTypeEnum.cancel],
        messageText: DialogMessageEnum.archiveStatusTasks,
        itemName: status.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.archive) {
          this.archiveStatusTasks(status.id);
        }
      }
    });
  }

  openEditTeamDialog(item) {
    const dialogRef = this.dialog.open(EditTeamAndProjectComponent, {
      data: {
        selectedTask: item,
      },
      direction:
        TextDirectionController.textDirection === 'rtl' ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openEditDateDialog(item, startOrEnd: string) {
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        dateTime: startOrEnd === 'start' ?
          (item.startDate ? item.startDate : new Date()) :
          (item.endDate ? item.endDate : new Date())
      }
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }
      let newDatetime = res.newDatetime;

      if (startOrEnd === 'start') {
        if ((item.endDate && moment(item.endDate).diff(moment(newDatetime)) >= 0) ||
          !item.endDate) {
          this.kanbanService
            .editTaskStartDate(item.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                item.startDate = newDatetime;
                this.updateLeftPanel();
                this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                this.snackbar.open(
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
                this.snackbar.open(
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
          this.snackbar.open(
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
        if ((item.startDate && moment(item.startDate).diff(moment(newDatetime)) <= 0) ||
          !item.startDate) {
          this.kanbanService
            .editTaskEndDate(item.id, moment.utc(newDatetime).format('YYYY-MM-DDTHH:mm:ss'))
            .subscribe(async res => {
                item.endDate = newDatetime;
                this.updateLeftPanel();
                this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                this.snackbar.open(
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
                this.snackbar.open(
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
          this.snackbar.open(
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

  openEditRangeDateDialog(item) {
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        startDateTime: new Date(),
        endDateTime: new Date()
      }
    });

    dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }
      const newStartTime = res.newStartTime;
      const newEndTime = res.newEndTime;

      if (newStartTime) {
        this.kanbanService.editTaskStartDate(item.id, moment.utc(newStartTime).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(async res => {
              item.startDate = newStartTime;
              // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
              this.snackbar.open(
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
              this.snackbar.open(
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
      }
      if (newEndTime) {

        this.kanbanService
          .editTaskEndDate(item.id, moment.utc(newEndTime).format('YYYY-MM-DDTHH:mm:ss'))
          .subscribe(async res => {
              item.endDate = newEndTime;
              // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
              this.snackbar.open(
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
              this.snackbar.open(
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
      }

    });
  }

  async deleteTaskDate($e, item, startOrEnd: string) {
    $e.stopPropagation();
    $e.cancelBubble = true;
    const dialogRef = this.dialog.open(ShowMessageInDialogComponent, {
      minWidth: '100px',
      data: {
        buttonNumbers: 2,
        buttonText: [ButtonTypeEnum.delete, ButtonTypeEnum.cancel],
        messageText: startOrEnd === 'start' ? DialogMessageEnum.deleteTaskStartDate : DialogMessageEnum.deleteTaskEndDate,
        itemName: item.title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result === ButtonTypeEnum.delete) {
          if (startOrEnd === 'start') {
            this.kanbanService
              .editTaskStartDate(item.id, '')
              .subscribe(async res => {
                  item.startDate = null;
                  // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                  this.snackbar.open(
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
                  this.snackbar.open(
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
              .editTaskEndDate(item.id, '')
              .subscribe(async res => {
                  item.endDate = null;
                  // this.mainWithInspectorService.changeEditingTask(this.selectedTask);
                  this.snackbar.open(
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
                  this.snackbar.open(
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

  openAddMemberDialog(item) {
    const copyOfMembers = item.usersAssignedTo.map((x) =>
      Object.assign({}, x)
    );
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        type: AddMemberDialogTypeEnum.addMemberToTask,
        memberList: item.usersAssignedTo,
        teamId: item.teamId,
        projectId: item.projectId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('copy is:');
      // console.log(copyOfMembers);
      // console.log('selected is:');
      // console.log(this.selectedTask.usersAssignedTo);

      const newAssignees: string[] = [];
      if (result == null) {
        return;
      }
      result[0].forEach((a) => {
        if (copyOfMembers.findIndex((u) => u.userId === a.userId) === -1) {
          newAssignees.push(a.userId);
          item.usersAssignedTo.push(a);
        }
      });
      // console.log('newAssignees');
      // console.log(newAssignees);
      if (newAssignees.length <= 0) {
        return;
      }
      const assignTask = new AssignTaskDTO(item.id, newAssignees);
      this.kanbanService.assignTask(assignTask).subscribe(
        async (res) => {
          this.snackbar.open(
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
          this.snackbar.open(
            await this.translateService.get('Snackbar.addAssigneeError').toPromise(),
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

  joinTask(item) {
    const newAssignees = [];
    newAssignees.push(this.jwtTokenService.getCurrentUserId());
    const assignTask = new AssignTaskDTO(item.id, newAssignees);
    this.kanbanService.assignTask(assignTask).subscribe(
      async (res) => {
        item.usersAssignedTo.push(this.jwtTokenService.getCurrentUser());
        this.snackbar.open(
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
        this.snackbar.open(
          await this.translateService.get('Snackbar.addAssigneeError').toPromise(),
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

  openDialog(status) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: {
        isAddingFromHeader: false,
        selectedProject: this.selectedProject,
        selectedTeam: this.selectedTeam,
        dropLists: this.dropLists,
        status: status,
        showingTasks: this.showingTasks,
        allTasks: this.allTasks,
      },
      direction:
        TextDirectionController.textDirection === 'rtl' ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  dropTask(event: CdkDragDrop<any>) {
    this.isListAnimationDisabled = true;
    const previousIndex = event.previousContainer.data.findIndex(
      (item) => item === event.item.data
    );

    // If the task is moved to the same list we must update the boardManualEvenOrder
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, event.currentIndex);
      const x = event.container.data[event.currentIndex] as GeneralTaskDTO;
      x.boardManualEvenOrder = event.currentIndex - 1 >= 0 ?
        event.container.data[event.currentIndex - 1].boardManualEvenOrder - 1 :
        ((event.container.data[event.currentIndex + 1]) ?
          event.container.data[event.currentIndex + 1].boardManualEvenOrder + 1 : 1);
      this.kanbanService.updateTaskBoardManualOrder(x.id, x.boardManualEvenOrder).subscribe(
        async (res) => {
          // this.snackbar.open(
          //   await this.translateService.get('Snackbar.taskBoardOrderChanged').toPromise(),
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
          this.snackbar.open(
            await this.translateService.get('Snackbar.taskBoardOrderChangeError').toPromise(),
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
      // this.mainWithInspectorService.changeEditingTask(x);
    } else {
      // If the task is moved to another list we must update the boardManualEvenOrder and change the status
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        event.currentIndex
      );

      setTimeout(() => {
        this.taskDropped = true;
        setTimeout(() => {
          this.taskDropped = false;
        }, 10);
      }, 10);
      const taskInNewStatus = event.container.data[event.currentIndex];
      const previousTaskInNewStatus = event.currentIndex - 1 >= 0 ? event.container.data[event.currentIndex - 1] : null;
      // console.log('previousTaskInNewStatus');
      // console.log(previousTaskInNewStatus);
      // console.log('taskInNewStatus');
      // console.log(taskInNewStatus);
      taskInNewStatus.boardManualEvenOrder = previousTaskInNewStatus ?
        previousTaskInNewStatus.boardManualEvenOrder - 1 :
        ((event.container.data[event.currentIndex + 1]) ?
          event.container.data[event.currentIndex + 1].boardManualEvenOrder + 1 : 1);
      // console.log('taskInNewStatusUpdatedBoardId');
      // console.log(taskInNewStatus);
      this.kanbanService.updateStatus(event.container.data[event.currentIndex].id,
        +event.container.id, taskInNewStatus.boardManualEvenOrder)
        .subscribe(async (res) => {
          taskInNewStatus.statusId = +event.container.id;
          taskInNewStatus.modifiedOn = new Date();
          this.showingStatuses.forEach((s) => {
            if (s.id === +event.container.id) {
              taskInNewStatus.statusTitle = s.title;
            }
          });
          this.mainWithInspectorService.changeEditingTask(taskInNewStatus);
          // Can cause problems
          // this.selectedTask.boardManualEvenOrder = taskInNewStatus.boardManualEvenOrder;

          this.dropLists.set(+event.previousContainer.id, this.dropLists.get(+event.previousContainer.id).filter(
              (t) => t.id !== taskInNewStatus.id
            )
          );
          this.snackbar.open(
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
        });
    }

    // We must update the boardManualEvenOrder of the tasks in the source and destination list and normalize them if status changed
    if (event.previousContainer !== event.container) {
      // console.log('yyyyyyyyyyyyyyy');
      let i = 2;
      for (const task of this.dropLists.get(+event.previousContainer.id).reverse()) {
        // console.log('task');
        // console.log(task);
        task.boardManualEvenOrder = i;
        this.allTasks.find((t) => t.id === task.id).boardManualEvenOrder = i;
        i += 2;
      }

    }

    // We must update the boardManualEvenOrder of the tasks only in the source list and normalize them if status not changed
    let j = 2;
    for (const task of this.dropLists.get(+event.container.id).reverse()) {
      // console.log('task2');
      // console.log(task);
      task.boardManualEvenOrder = j;
      this.allTasks.find((t) => t.id === task.id).boardManualEvenOrder = j;
      j += 2;
    }

    setTimeout(() => {
      this.isListAnimationDisabled = false;
    }, 100);
  }

  unselectSelectedTask() {
    this.mainWithInspectorService.changeMessage(null);
  }

  setColorForStatus(statusTitle: string) {
    // const colors = [
    //   'rgba(66,120,223,0.1)',
    //   'rgba(66, 223, 101, 0.1)',
    //   'rgba(223, 138, 39, 0.1)',
    //   'rgba(223, 28, 180, 0.1)',
    //   'rgba(208, 223, 28, 0.1)',
    //   'rgba(28, 188, 223, 0.1)',
    //   'rgba(114, 28, 223, 0.1)',
    //   'rgba(7, 237, 182, 0.1)',
    //   'rgba(2, 134, 163, 0.1)',
    // ];
    // const fontColors = [
    //   'rgba(66,120,223,1)',
    //   'rgba(66, 223, 101, 1)',
    //   'rgba(223, 138, 39, 1)',
    //   'rgba(223, 28, 180, 1)',
    //   'rgba(208, 223, 28, 1)',
    //   'rgba(28, 188, 223, 1)',
    //   'rgba(114, 28, 223, 1)',
    //   'rgba(7, 237, 182, 1)',
    //   'rgba(2, 134, 163, 1)',
    // ];
    const colors = [
      'rgba(46,184,112,0.1)',
      'rgba(252,199,0,0.1)',
      'rgba(2,134,163,0.1)',
      'rgba(230,71,115,0.1)',
      'rgba(114,28,223,0.1)',
      'rgba(227,83,42,0.1)',
      'rgba(20,98,224,0.1)',
      'rgba(5,146,123,0.1)',
      'rgba(224,95,20,0.1)',
      'rgba(81,1,143,0.1)'
    ];

    const fontColors = [
      'rgba(46,184,112,1)',
      'rgba(252,199,0,1)',
      'rgba(2,134,163,1)',
      'rgba(230,71,115,1)',
      'rgba(114,28,223,1)',
      'rgba(227,83,42,1)',
      'rgba(20,98,224,1)',
      'rgba(5,146,123,1)',
      'rgba(224,95,20,1)',
      'rgba(81,1,143,1)'
    ];
    const calculateScore = (str = '') => {
      return str.split('').reduce((acc, val) => {
        return acc + val.charCodeAt(0);
      }, 0);
    };
    // console.log(colors[calculateScore(statusTitle) % 8]);
    return [
      colors[calculateScore(statusTitle) % 9],
      fontColors[calculateScore(statusTitle) % 9],
    ];
  }

  dropStatus(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.showingStatuses, event.previousIndex, event.currentIndex);
    const objectCurrent = event.container.data[event.currentIndex].id;
    // based on front index
    // const order = event.currentIndex > event.previousIndex ? (event.currentIndex + 1) * 2 + 1 : (event.currentIndex + 1) * 2 - 1;

    // based on evenOrder
    const order = event.currentIndex > event.previousIndex ?
      event.container.data[event.currentIndex - 1].evenOrder + 1 :
      event.container.data[event.currentIndex + 1].evenOrder - 1;
    if (event.currentIndex !== event.previousIndex) {
      event.container.data[event.currentIndex].evenOrder = order;
      let startOrder = 2;
      for (const status of event.container.data) {
        status.evenOrder = startOrder;
        startOrder += 2;
      }
      // console.log('event.container.data:');
      // console.log(event.container.data);
      this.kanbanService
        .updateColStatus(objectCurrent, order)
        .subscribe(async (res) => {
          this.snackbar.open(
            await this.translateService
              .get('Snackbar.StatusChanged')
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
        });
    }
  }

  changeStatus(item, status: StatusDTO) {
    // console.log(event);
    const selectedTask: GeneralTaskDTO = {...this.selectedTask};
    // console.log('selectedTask:');
    // console.log(selectedTask);
    // console.log('this.selectedTask:');
    // console.log(this.selectedTask);
    // console.log('event.source');
    // console.log(event.source);
    this.kanbanService
      .updateStatus(item.id, status.id)
      .subscribe(
        async (res) => {
          item.statusId = status.id;
          item.statusTitle = status.title;
          // this.mainWithInspectorService.changeEditingTask(selectedTask);

          this.snackbar.open(
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
          this.snackbar.open(
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

  controlOpenStatusMenu(item, statusTrigger, j) {
    // console.log('hi');
    this.bringStatuses(item);
    setTimeout(() => {
      if (!this.onTableStatusMenu[j] && this.onTableStatus[j]) {
        statusTrigger.openMenu();
      }
    }, 1000);
  }

  controlCloseStatusMenu(statusTrigger, j) {
    setTimeout(() => {
      if (!this.onTableStatusMenu[j]) {
        statusTrigger.closeMenu();
      }
    }, 100);
  }

  bringStatuses(item) {
    // this.selectedTask = item;
    if (item != null) {
      this.statuses = [];
      // this.getStatuses();
      if (item.projectId != null) {
        this.allStatuses.forEach(s => {
          if (s.projectId === item.projectId) {
            this.statuses.push(s);
          }
        });
      } else if (item.teamId != null) {
        this.allStatuses.forEach(s => {
          if (s.teamId === item.teamId) {
            this.statuses.push(s);
          }
        });
      } else if (item.teamId == null && item.projectId == null) {
        // handle personal tasks
        this.allStatuses.forEach(s => {
          if (s.userProfileId != null) {
            this.statuses.push(s);
          }
        });
      }
    }
  }

  controlOpenDescriptionMenu(descriptionTrigger, j) {
    // console.log('hi');
    setTimeout(() => {
      if (!this.onTableDescription[j] && this.onTableTitle[j]) {
        descriptionTrigger.openMenu();
      }
    }, 1000);
  }

  controlCloseDescriptionMenu(descriptionTrigger, j) {
    // console.log('hi');
    setTimeout(() => {
      if (!this.onTableDescription[j]) {
        descriptionTrigger.closeMenu();
      }
    }, 100);
  }

  controlOpenPropertyMenu(propertyTrigger, j) {
    setTimeout(() => {
      if (!this.onTablePropertyMenu[j] && this.onTableProperty[j]) {
        propertyTrigger.openMenu();
      }
    }, 1000);
  }

  controlClosePropertyMenu(propertyTrigger, j) {
    setTimeout(() => {
      if (!this.onTablePropertyMenu[j]) {
        propertyTrigger.closeMenu();
      }
    }, 100);
  }

  controlOpenMemberMenu(memberTrigger, j) {
    setTimeout(() => {
      if (!this.onTableMemberMenu[j] && this.onTableMember[j]) {
        memberTrigger.openMenu();
      }
    }, 1000);
  }

  controlCloseMemberMenu(statusTrigger, j) {
    setTimeout(() => {
      if (!this.onTableMemberMenu[j]) {
        statusTrigger.closeMenu();
      }
    }, 100);
  }

  controlOpenPriorityMenu(statusTrigger, j) {
    // console.log('hi');
    // this.bringStatuses(item);
    setTimeout(() => {
      if (!this.onTablePriorityMenu[j] && this.onTablePriority[j]) {
        statusTrigger.openMenu();
      }
    }, 1000);
  }

  controlClosePriorityMenu(statusTrigger, j) {
    setTimeout(() => {
      if (!this.onTablePriorityMenu[j]) {
        statusTrigger.closeMenu();
      }
    }, 100);
  }

  activateInspector() {
    this.dataService.changeActiveNotificationTab('inspector');
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'seven-task-add-task',
  templateUrl: 'addTask.html',
  styleUrls: ['./addTask.scss'],
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
    fadeInOutAnimation,
  ],
})
export class AddTaskComponent implements OnInit {
  textDirection = TextDirectionController.textDirection;
  domainName: string = DomainName;
  public selectedTeamFromAddTeamComponent: Array<any> = [];
  public selectedTeamFromMenu: TeamDTO;
  public selectedProjectFromAddProjectComponent: Array<any> = [];
  public selectedProjectFromMenu: ProjectDTO;
  public teamDepartments: Array<any> = [];
  public memberList: Array<any> = [];
  editChecklist = false;
  isRemovingChecklistItem: boolean[] = [];
  activeTab = 'Assignments';
  activeTeam = '';
  allTeams = [];
  activeProjects = [];
  activeProject = '';
  showingProjects = [];
  allStatuses: StatusDTO[] = [];
  // addingChecklists: CheckListDTO[] = [];
  addingChecklistItems: ChecklistItemPostDTO[] = [];
  addingAttachments: FileDTO[] = [];
  isRemovingAttachment = '';
  sentCreateTaskRequest = false;

  iconRotationDegree = TextDirectionController.iconRotationDegree;

  public addTaskForm: FormGroup;
  newTaskDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    public addTaskDialogRef: MatDialogRef<AddTaskComponent>,
    private kanbanService: KanbanService,
    private mainWithInspectorService: MainWithInspectorService,
    private loadingService: LoadingService,
    private snackbar: MatSnackBar,
    private teamService: TeamService,
    private projectService: ProjectService,
    private _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    private dataService: DataService,
    private jwtTokenService: JWTTokenService,
    public dialog: MatDialog,
    private router: Router,
    private fileService: FileService,
    private directionService: DirectionService,
    public translateService: TranslateService
  ) {
    this.directionService.currentRotation.subscribe((message) => {
      this.iconRotationDegree = message;
      // console.log('hi');
      // console.log(this.iconRotationDegree);
    });
  }

  ngOnInit(): void {
    this.mainWithInspectorService.currentAllStatuses.subscribe(message => {
      this.allStatuses = message;
    });

    this.teamService.getAllTeam().subscribe((res) => {
      this.allTeams = res;
    });

    this.projectService.getActiveProjects().subscribe((res) => {
      this.activeProjects = res;
      this.showingProjects = this.activeProjects;
      // // If project has a team ...
      // if (this.inputData.selectedTeam != null) {
      //   res.forEach((p) => {
      //     if (
      //       p.teamId?.toString() === this.inputData.selectedTeam.id.toString()
      //     ) {
      //       this.showingProjects.push(p);
      //     }
      //   });
      // }
      //
      // // If there is no team and project selected we show personal projects
      // if (this.inputData.selectedTeam == null && this.inputData.selectedProject == null) {
      //   res.forEach((p) => {
      //     if (p.teamId == null) {
      //       this.showingProjects.push(p);
      //     }
      //   });
      // }
      //
      // // Show personal projects and selected one(from leftNavBar) must be the first in array
      // if (this.inputData.selectedTeam == null && this.inputData.selectedProject != null) {
      //   res.forEach((p) => {
      //     if (p.teamId?.toString() === this.inputData.selectedProject.teamId.toString()) {
      //       if (p.id.toString() === this.inputData.selectedProject.id) {
      //         this.showingProjects.splice(0, 0, p);
      //       } else {
      //         this.showingProjects.push(p);
      //       }
      //     }
      //   });
      // }
    });

    this.addTaskForm = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Description: new FormControl(null),
      StartDate: new FormControl(null),
      EndDate: new FormControl(null),
      Priority: new FormControl(null),
      ChecklistTitle: new FormControl(null),
    });

    if (this.inputData.selectedProject != null) {
      console.log('project is');
      this.activeProject = this.inputData.selectedProject?.id.toString();
      this.activeTeam = this.inputData.selectedProject?.teamId == null ? '' : this.inputData.selectedProject?.teamId;
      this.selectedProjectFromMenu = this.inputData.selectedProject;
      this.selectedTeamFromMenu = this.inputData.selectedProject.teamId != null ? this.selectedTeamFromMenu = {
        name: this.inputData.selectedProject.teamName,
        id: this.inputData.selectedProject.teamId
      } as TeamDTO : null;
    }
    if (this.inputData.selectedTeam != null) {
      console.log('team is');
      this.activeTeam = this.inputData.selectedTeam.id.toString();
      this.selectedTeamFromMenu = this.inputData.selectedTeam;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: 'snack-bar-container',
      direction:
        TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
    });
  }

  openTeamPage() {
    this.router.navigateByUrl('team');
  }

  openProjectPage() {
    this.router.navigateByUrl('project');
  }

  selectTeamFromMenu(team: TeamDTO) {
    this.selectedTeamFromMenu = team;
    this.selectTeam(team.id);
  }

  selectProjectFromMenu(project: ProjectDTO) {
    this.selectedProjectFromMenu = project;
    this.selectProject(project);
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

  openAddMember(): void {
    console.log(this.activeProject);
    console.log(this.activeTeam);
    // console.log(this.inputData.selectedTeam);
    // console.log(this.inputData.selectedProject);
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      data: {
        memberList: this.memberList,
        type: AddMemberDialogTypeEnum.addMemberToTask,
        // tslint:disable-next-line:max-line-length
        teamId: this.activeTeam != null && this.activeTeam !== '' ? +this.activeTeam : null,
        // tslint:disable-next-line:max-line-length
        projectId: +this.activeProject !== 0 && this.activeProject != null && this.activeProject !== ''
          ? +this.activeProject : null,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result[0] != null) {
        for (let i = 0; i < result[0].length; i++) {
          this.memberList.push(result[0][i]);
        }
      }
    });
  }

  selectTeam(id) {
    this.unselectProject();
    console.log('This teamID was selected : ' + id);
    this.memberList = [];
    this.activeTeam = id;
    this.teamDepartments.length = 0;
    // this.showingProjects = [];
    // this.activeProjects.forEach((project) => {
    //   if (project.teamId === id) {
    //     // console.log(project);
    //     this.showingProjects.push(project);
    //   }
    // });
  }

  unselectTeam() {
    // this.showingProjects = [];
    // this.activeProjects.forEach((project) => {
    //   if (project.teamId == null) {
    //     this.showingProjects.push(project);
    //   }
    // });
    this.activeTeam = '';
    this.activeProject = '';
    this.teamDepartments.length = 0;
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

  selectProject(project: ProjectDTO) {
    console.log('This project was selected: ' + project.id);
    this.activeProject = project.id.toString();
    this.activeTeam = '';
    this.allTeams.forEach(t => {
      if (t.id === project.teamId) {
        this.activeTeam = t.id;
        this.selectedTeamFromMenu = t;
      }
    });
  }

  unselectProject() {
    this.activeProject = '';
  }

  removeItemFromList(arr: Array<any>, item) {
    const index: number = arr.indexOf(item);
    arr.splice(index, 1);
  }

  removeChecklistItem(item: ChecklistItemPostDTO) {
    this.addingChecklistItems = this.addingChecklistItems.filter(
      (a) => a.title !== item.title
    );
  }

  openAddItemToChecklistDialog() {
    const dialogRef = this.dialog.open(AddChecklistItemComponent, {
      data: {
        addingChecklistItems: this.addingChecklistItems,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.selectProject(this.selectedProjectFromAddProjectComponent[0].id);
    });
  }

  private convertTaskPostTOGeneralTask(taskPost: GeneralTaskPostDTO): GeneralTaskDTO {
    let statusID;
    if (taskPost.statusId == null) {
      if (taskPost.projectId != null) {
        for (const status of this.allStatuses) {
          if (status.projectId === taskPost.projectId) {
            statusID = status.id;
            break;
          }
        }
      } else if (taskPost.teamId != null) {
        for (const status of this.allStatuses) {
          if (status.teamId === taskPost.teamId) {
            statusID = status.id;
            break;
          }
        }
      } else if (taskPost.teamId == null && taskPost.projectId == null) {
        for (const status of this.allStatuses) {
          if (status.userProfileId != null) {
            statusID = status.id;
            break;
          }
        }
      }
    }
    return new GeneralTaskDTO(
      taskPost.title,
      -1,
      taskPost.title,
      new Date(),
      new Date(),
      taskPost.description,
      taskPost.endDate,
      false,
      taskPost.startDate,
      this.jwtTokenService.getCurrentUser(),
      this.jwtTokenService.getCurrentUser(),
      taskPost.priorityId,
      'loading',
      false,
      [],
      taskPost.statusId !== null ? taskPost.statusId : statusID,
      'loading',
      taskPost.teamId,
      taskPost.projectId,
      'loading',
      'loading',
      [],
      [],
      [],
      2,
      []
    );
  }

  addTask() {
    if (this.sentCreateTaskRequest) {
      return;
    }
    this.sentCreateTaskRequest = true;
    if (this.addTaskForm.invalid || this.addTaskForm.controls.Title.value.toString().trim() === '') {
      return;
    }
    this.addTaskDialogRef.close();
    const assignees = [];
    this.memberList.forEach((member) => {
      assignees.push(member.userId);
    });
    const addingAttachmentsGuids: string[] = [];
    this.addingAttachments.forEach((file) => {
      addingAttachmentsGuids.push(file.fileContainerGuid);
    });

    if (!this.inputData.isAddingFromHeader) {
      if (this.inputData.selectedProject != null) {
        this.activeProject = this.inputData.selectedProject.id.toString();
      }
      if (this.inputData.selectedTeam != null) {
        this.activeTeam = this.inputData.selectedTeam.id.toString();
      }
    }

    const addTaskData = new GeneralTaskPostDTO(
      this.addTaskForm.controls.Title.value,
      this.addTaskForm.controls.Description.value,
      this.newTaskDateRange.controls.start.value,
      this.newTaskDateRange.controls.end.value,
      +this.addTaskForm.controls.Priority.value,
      this.activeTeam != null ? +this.activeTeam : null,
      this.activeProject != null ? +this.activeProject : null,
      assignees,
      this.inputData.status != null ? this.inputData.status.id : null,
      this.addingChecklistItems,
      addingAttachmentsGuids
    );
    if (addTaskData.priorityId === 0) {
      addTaskData.priorityId = 1;
    }
    if (addTaskData.teamId === 0) {
      addTaskData.teamId = null;
    }
    if (addTaskData.projectId === 0) {
      addTaskData.projectId = null;
    }
    // this.loadingService.requestStarted();
    // const addingTask: GeneralTaskDTO = this.convertTaskPostTOGeneralTask(addTaskData);
    // this.dataService.changeAddingTask(addingTask);

    this.kanbanService.addTask(addTaskData).subscribe(
      async (res) => {
        res.value.modifiedOn = new Date(CalendarService.convertUtcToLocalTime(res.value.modifiedOn, 'YYYY-MM-DDTHH:mm:ss'));
        // this.loadingService.requestEnded();
        this.dataService.changeTaskNumber(
          this.dataService.getTasksNumber() + 1
        );

        // if (this.inputData.isAddingFromHeader) {
        // if is needed for checking signalR
        if (this.inputData.allTasks.find(x => x.id === res.value.id) === -1) {
          this.dataService.changeAddingTask(res.value);
        }
        // }
        this.addTaskDialogRef.close();
        // tslint:disable-next-line:max-line-length
        // if (
        //   !this.inputData.isAddingFromHeader &&
        //   this.inputData.allTasks != null &&
        //   this.inputData.showingTasks != null &&
        //   this.inputData.dropLists != null
        // ) {
        //   this.inputData.allTasks.splice(0, 0, res.value);
        //   this.inputData.showingTasks.splice(0, 0, res.value);
        //   this.inputData.dropLists
        //     .get(this.inputData.status.id)
        //     .splice(0, 0, res.value);
        // }
        this.openSnackBar(
          await this.translateService
            .get('Snackbar.taskCreated')
            .toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise()
        );
        this.addTaskForm.reset();
        Object.keys(this.addTaskForm.controls).forEach((key) => {
          this.addTaskForm.get(key).setErrors(null);
        });
      },
      async (error) => {
        this.loadingService.resetSpinner();
        this.openSnackBar(
          await this.translateService.get('Snackbar.addTaskError').toPromise(),
          await this.translateService.get('Buttons.gotIt').toPromise()
        );
      }
    );
  }

  clickSelectFile(): void {
    $('#fileInNewTask').click();
  }

  uploadFile(event: UploadResponseModel) {
    // this.addingAttachments.push(event.value.successfulFileUpload[0]);
    event.value.successfulFileUpload.forEach((file) =>
      this.addingAttachments.push(file)
    );
    // console.log('this is uploadFile:');
    // console.log(event.value);
  }

  removeAttachment(fileId) {
    this.addingAttachments = this.addingAttachments.filter(
      (a) => a.fileContainerGuid !== fileId
    );
  }
}

@Component({
  // tslint:Disable-next-line:component-selector
  selector: 'seven-task-add-project',
  templateUrl: 'AddProject.html',
  styleUrls: ['./AddProjectStyle.scss'],
})
// tslint:Disable-next-line:component-class-suffix
export class AddProjectComponent implements OnInit {
  allProjects;
  textDirection = TextDirectionController.textDirection;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    // tslint:Disable-next-line:variable-name
    private snackbar: MatSnackBar,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<AddTeam>
  ) {
  }

  ngOnInit(): void {
    this.teamService
      .getProjects(this.inputData.selectedTeam)
      .subscribe((res) => {
        this.allProjects = res.value;
      });
  }

  // tslint:Disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      direction:
        TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl',
    });
  }

  changeActiveProject(project) {
    if (this.inputData.activeProject.length !== 0) {
      this.inputData.activeProject.pop();
    }
    this.inputData.activeProject.push(project);
  }
}

@Component({
  selector: 'seven-task-add-checklist-item',
  templateUrl: 'AddChecklistItem.html',
  styleUrls: ['./AddChecklistItem.scss'],
})
export class AddChecklistItemComponent implements OnInit {
  textDirection = TextDirectionController.textDirection;
  checklistItems: ChecklistItemPostDTO[] = this.inputData.addingChecklistItems;
  addItemForm = new FormGroup({
    title: new FormControl(),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    public dialogRef: MatDialogRef<AddTaskComponent>
  ) {
  }

  ngOnInit() {
  }

  addItem() {
    if (this.addItemForm.controls.title.value != null && this.addItemForm.controls.title.value !== '') {
      this.checklistItems.splice(0, 0,
        new ChecklistItemPostDTO(this.addItemForm.controls.title.value, false)
      );

      this.addItemForm.controls.title.reset();
    }
  }

  removeItem(i: ChecklistItemPostDTO) {
    this.checklistItems = this.checklistItems.filter(
      (item) => item.title !== i.title
    );
    // this.inputData.addingChecklistItems = this.inputData.addingChecklistItems.filter((item) => item.title !== i.title);
  }

  sumbit() {
    // this.inputData.addingChecklistItems = this.checklistItems;
    this.dialogRef.close();
  }
}

export class RangeTask {
  public isInCurrentView: boolean;
  public isStartingAtCurrentView: boolean;
  public isEndingAtCurrentView: boolean;
  public color: string;
  public offsetY: number;
  public offsetX: number;
  public width: number;
  public task: GeneralTaskDTO;

  constructor(
    isInCurrentView: boolean,
    isStartingAtCurrentView: boolean,
    isEndingAtCurrentView: boolean,
    color: string,
    offsetY: number,
    offsetX: number,
    width: number,
    task: GeneralTaskDTO
  ) {
    this.isInCurrentView = isInCurrentView;
    this.isStartingAtCurrentView = isStartingAtCurrentView;
    this.isEndingAtCurrentView = isEndingAtCurrentView;
    this.color = color;
    this.offsetY = offsetY;
    this.offsetX = offsetX;
    this.width = width;
    this.task = task;
  }
}
