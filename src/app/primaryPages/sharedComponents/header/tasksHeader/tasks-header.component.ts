import {Component, ElementRef, HostBinding, HostListener, Injectable, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from '../../../../services/dataService/data.service';
import {Observable, Subscription} from 'rxjs';
import {MainWithInspectorService} from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import {GeneralTaskDTO} from '../../../../DTOs/kanban/GeneralTaskDTO';
import {MatDialog} from '@angular/material/dialog';
import {AddTaskComponent} from '../../../../pages/kanban/to-do.component';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {TeamDTO} from '../../../../DTOs/team/Team.DTO';
import {PriorityDTO} from '../../../../DTOs/kanban/PriorityDTO';
import {KanbanService} from '../../../../services/kanbanService/kanban.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserDTO} from '../../../../DTOs/user/UserDTO';
import {PriorityFilterModel} from '../../../../DTOs/filter/PriorityFilterModel';
import {BaseFilterModel} from '../../../../DTOs/filter/BaseFilterModel';
import {AssigneeFilterModel} from '../../../../DTOs/filter/AssigneeFilterModel';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {UrgentFilterModel} from '../../../../DTOs/filter/UrgentFilterModel';
import {DomainName} from '../../../../utilities/PathTools';
import {TranslateService} from '@ngx-translate/core';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {SortCategoryDTO} from '../../../../DTOs/sort/SortCategoryDTO';
import {StatusFilterModel} from '../../../../DTOs/filter/StatusFilterModel';
import {CreatorFilterModel} from '../../../../DTOs/filter/CreatorFilterModel';
import {fadeInOutAnimation} from 'src/animations/animations';
import {JWTTokenService} from '../../../../services/accountService/jwttoken.service';
import {SortSettings} from '../../../../DTOs/sort/SortSettings';
import {TagFilterModel} from '../../../../DTOs/filter/TagFilterModel';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-tasks-header',
  templateUrl: './tasks-header.component.html',
  styleUrls: ['../SCSS/header-style.scss'],
  animations: [
    fadeInOutAnimation,
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(+45px)',
        opacity: 0,
        visibility: 'hidden'
      })),
      state('out', style({
        transform: 'translateX(0%)',
        opacity: 1,
        // visibility: 'visible'
      })),
      transition('* => *', animate('200ms ease-in')),
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [
            style({opacity: 0}),
            stagger('60ms', animate('600ms ease-out', style({opacity: 1}))),
          ],
          {optional: true}
        ),
        query(':leave',
          animate('200ms', style({opacity: 0.0})),
          {optional: true}
        )
      ]),
    ]),
    trigger('fadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('out', style({opacity: 0})),
      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [style({opacity: 0}), animate(200)]),
      // fade out when destroyed. this could also be written as transition('void => *')
      // transition(':leave', animate('200ms', style({opacity: 0}))),
    ]),
  ]
})
export class TasksHeaderComponent implements OnInit, OnDestroy {


  disabled = false;
  sortName;
  isAscending;
  sortCategories = [
    new SortCategoryDTO(1, 'manual'),
    new SortCategoryDTO(2, 'priority'),
    new SortCategoryDTO(3, 'creationDate'),
    new SortCategoryDTO(4, 'estimatedTime')];
  // new SortCategoryDTO(4, 'lastModifiedOn')
  searchClicked = false;
  domainName: string = DomainName;
  public viewValue;
  subscription: Subscription;
  activeTab = '';
  selectedTask: GeneralTaskDTO;
  isPersonalProjectSelected: boolean;
  isPersonalSelected: boolean;
  isAllTasksSelected: boolean;
  selectedProject: ProjectDTO;
  selectedTeam: TeamDTO;

  addingTask: GeneralTaskDTO;
  searchedTask = '';

  filters = [];
  andOr = true;
  activeFilters: BaseFilterModel[] = [];
  taskPriorities: PriorityDTO[] = [];
  taskStatuses: string[] = [];
  priorityNotSelected = [];
  tasksUsers: UserDTO[] = [];
  activePriorityFilters: Array<number[]>;
  enabledFilters: BaseFilterModel[];

  activeAssigneeFilters: string[];
  filterAnimationFinished = true;

  headerIsSmall = false;

  separatorKeysCodes: number[] = [ENTER];
  tagCtrl = new FormControl('');
  tags: string[] = [];
  textDirection = TextDirectionController.getTextDirection();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  public constructor(private dataService: DataService,
                     private mainWithInspectorService: MainWithInspectorService,
                     private kanbanService: KanbanService,
                     private _snackBar: MatSnackBar,
                     private jwtTokenService: JWTTokenService,
                     public dialog: MatDialog,
                     public translateService: TranslateService) {
    if (localStorage.getItem('languageCode') === 'en-US') {
      this.filters = ['Urgent', 'Priority', 'Assignee', 'Status', 'Creator'];
      // if (this.isUserBeta()) {
      this.filters.push('Tag');
      // }
    } else {
      this.filters = ['اورژانسی', 'اولویت', 'مسئول', 'وضعیت', 'سازنده'];
      // if (this.isUserBeta()) {
      this.filters.push('تگ');
      // }
    }

  }

  ngOnInit(): void {
    this.dataService.currentIsAscending.subscribe(message =>
      this.isAscending = message
    );

    this.dataService.currentTagFromInspector.subscribe(message => {
        if (message != null && message !== '') {
          this.activeFilters.push(new TagFilterModel([message], true));
          this.filterTasks();
        }
      }
    )
    ;

    this.dataService.shouldMakeHeaderSmallerObservable.subscribe(bool => {
      this.headerIsSmall = bool;
    });

    this.dataService.currentSortName.subscribe(message => {
      this.sortName = message;
    });

    if (localStorage.getItem('sortSettings') == null) {
      localStorage.setItem(
        'sortSettings',
        JSON.stringify(
          new SortSettings('creationDate', false)
        )
      );
      this.sortName = 'creationDate';
      this.isAscending = false;
    } else {
      const sortSettings: SortSettings = JSON.parse(
        localStorage.getItem('sortSettings')
      );
      this.dataService.changeSortName(sortSettings.sortName);
      this.dataService.changeIsAscending(sortSettings.isAscending);
    }


    this.dataService.currentAndOr.subscribe(message => {
      this.andOr = message;
    });

    this.dataService.currentEnabledFilters.subscribe(message => {
      this.enabledFilters = message;
      // this.activeFilters = [];
      // this.loadFilters();
    });

    this.dataService.currentSearchedTask.subscribe(message => {
      this.searchedTask = message;
    });

    this.dataService.currentAddingTask.subscribe(message => {
      this.addingTask = message;
    });

    this.dataService.currentIsAllTasksSelected.subscribe(message => {
      this.isAllTasksSelected = message;
      // this.dataService.changeSearchedTask('');
    });

    this.subscription = this.dataService.currentMessage.subscribe(message => {
      this.viewValue = message;
    });

    this.mainWithInspectorService.currenttask.subscribe(message => {
      this.selectedTask = message;
    });

    this.dataService.currentIsPersonalProjectSelected.subscribe(message => {
      this.isPersonalProjectSelected = message;
      // this.dataService.changeSearchedTask('');

    });

    this.dataService.currentIsPersonalSelected.subscribe(message => {
      this.isPersonalSelected = message;
      // this.dataService.changeSearchedTask('');

    });

    this.dataService.currentProjectTasks.subscribe(message => {
      this.selectedProject = message;
      // this.dataService.changeSearchedTask('');

    });

    this.dataService.currentTeamTasks.subscribe(message => {
      this.selectedTeam = message;
      // this.dataService.changeSearchedTask('');
    });

    this.getTaskPriorities();
    this.getTasksUsers();
    this.loadFilters();
    this.getTaskStatuses();
    // this.filterTasks();

  }

  isUserBeta() {
    return this.jwtTokenService.isUserBeta();
  }

  ngOnDestroy() {
  }

  async addTag(event: MatChipInputEvent, activeFilter) {
    const value = (event.value || '').trim();
    if (value.length <= 2) {
      this._snackBar.open(
        await this.translateService
          .get('Snackbar.tagTitleTooShort')
          .toPromise(),
        await this.translateService.get('Buttons.gotIt').toPromise(),
        {
          duration: 2500,
          panelClass: 'snack-bar-container',
          direction:
            TextDirectionController.getTextDirection() === 'ltr'
              ? 'ltr'
              : 'rtl',
        }
      );
      return;
    }

    // Add our tag
    if (value) {
      activeFilter.tags.push(value);
    }

    // Clear the input value
    // event.chipInput!.clear();

    this.tagCtrl.setValue(null);
    this.filterTasks();
  }

  addTagFromButton(tag: string, activeFilter): void {
    activeFilter.tags.push(tag);
    this.tagCtrl.setValue(null);
    this.filterTasks();
  }

  removeTag(tag: string, activeFilter): void {
    const index = activeFilter.tags.indexOf(tag);

    if (index >= 0) {
      activeFilter.tags.splice(index, 1);
    }
    this.filterTasks();
  }

  disableAnimation() {
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, 10);

  }

  changeSortName(event) {
    if (event.value === 'manual') {
      this.dataService.changeIsAscending(true);
    }
    localStorage.setItem(
      'sortSettings',
      JSON.stringify(
        new SortSettings(event.value, this.isAscending)
      )
    );
    if (event == null || event === 'creationDate') {
      this.sortName = 'creationDate';
      this.dataService.changeSortName('creationDate');
    } else {
      this.dataService.changeSortName(event.value);
    }
  }

  changeIsAscending(event) {
    localStorage.setItem(
      'sortSettings',
      JSON.stringify(
        new SortSettings(this.sortName, event.value)
      )
    );
    if (event == null) {
      return;
    } else if (event === false) {
      this.dataService.changeIsAscending(false);
    } else {
      this.dataService.changeIsAscending(event.value);
    }
  }

  resetSort() {
    localStorage.setItem(
      'sortSettings',
      JSON.stringify(
        new SortSettings('manual', false)
      )
    );
    this.dataService.changeIsAscending(false);
    this.dataService.changeSortName('manual');
  }

  loadFilters() {
    this.disabled = false;
    this.activeFilters = [];
    this.activePriorityFilters = [];
    if (this.enabledFilters != null) {
      this.enabledFilters.forEach(filterObject => {
        this.activeFilters.push(filterObject);
        // if (key === 'Priority') {
        //   value.forEach(v => this.activePriorityFilters.push(v));
        // }
        // if (key === 'Urgent') {
        //   // value.forEach(v => this.activeFilters.push(v));
        // }
        // if (key === 'Assignee') {
        //   value.forEach(v => this.activeAssigneeFilters.push(v));
        // }
      });
    }
  }

  changeAndOr(andOr) {
    this.dataService.changeAndOr(andOr);
    this.filterTasks();
  }

  addFilterToActiveFilters(filter: string) {
    // document.getElementById('filtersToSelect').close();
    if (filter === 'Priority' || filter === 'اولویت') {
      const priorityFilter = new PriorityFilterModel(true, []);
      this.activeFilters.push(priorityFilter);
    }
    if (filter === 'Assignee' || filter === 'مسئول') {
      const assigneeFilter = new AssigneeFilterModel('Is', []);
      this.activeFilters.push(assigneeFilter);
    }
    if (filter === 'Creator' || filter === 'سازنده') {
      const creatorFilter = new CreatorFilterModel('Is', null);
      this.activeFilters.push(creatorFilter);
    }
    if (filter === 'Urgent' || filter === 'اورژانسی') {
      const urgentFilter = new UrgentFilterModel(null);
      this.activeFilters.push(urgentFilter);
    }

    if (filter === 'Status' || filter === 'وضعیت') {
      const statusFilter = new StatusFilterModel(true, []);
      this.activeFilters.push(statusFilter);
    }

    if (filter === 'Tag' || filter === 'تگ') {
      const tagFilter = new TagFilterModel([], true);
      this.activeFilters.push(tagFilter);
    }
  }

  removeFilter(i) {
    if (this.activeFilters.length === 1) {
      this.disabled = true;
      setTimeout(() => {
        this.activeFilters.splice(i, 1);
        this.filterTasks();
        this.disabled = false;
      }, 10);
    } else {
      this.activeFilters.splice(i, 1);
      this.filterTasks();
    }
  }

  clearFilters() {
    this.disabled = true;
    setTimeout(() => {
      this.activeFilters = [];
      this.tags = [];
      this.filterTasks();
      this.disabled = false;
    }, 10);
  }

  filterTasks() {
    // console.log(this.activeFilters);
    const enFilters = [];
    this.activeFilters.forEach(aFilter => {
      if ((aFilter instanceof UrgentFilterModel && aFilter.is != null) ||
        (aFilter instanceof PriorityFilterModel && aFilter.priorityIds.length > 0) ||
        (aFilter instanceof AssigneeFilterModel && aFilter.assigneesIds.length >= 0) ||
        (aFilter instanceof StatusFilterModel && aFilter.statusNames.length > 0) ||
        (aFilter instanceof CreatorFilterModel && aFilter.assigneesId != null) ||
        (aFilter instanceof TagFilterModel && aFilter.tags.length > 0)) {
        enFilters.push(aFilter);
      }
    });
    this.dataService.changeEnabledFilters(enFilters);
  }

  private getTaskPriorities() {
    this.kanbanService.getTaskPriorities().subscribe(res => {
      this.taskPriorities = res;
    }, async error => {
      this._snackBar.open(await this.translateService.get('Snackbar.problemGettingPriorities').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
      });
    });
  }

  private getTaskStatuses() {
    this.kanbanService.getAllStatuses().subscribe(res => {
      res.forEach(status => {
        if (!this.taskStatuses.includes(status.title)) {
          this.taskStatuses.push(status.title);
        }
      });
    }, async error => {
      this._snackBar.open(await this.translateService.get('Snackbar.problemGettingStatuses').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
      });
    });
  }

  private getTasksUsers() {
    this.kanbanService.getTasksUsers().subscribe(res => {
      this.tasksUsers = res.value;
    }, async error => {
      this._snackBar.open(await this.translateService.get('Snackbar.problemTaskUsers').toPromise(), await this.translateService.get('Buttons.gotIt').toPromise(), {
        duration: 2000,
        panelClass: 'snack-bar-container',
        direction: TextDirectionController.getTextDirection() === 'ltr' ? 'ltr' : 'rtl'
      });
    });
  }


  newMessage() {
    this.dataService.changeMessage(this.viewValue);
    localStorage.setItem('kanbanViewSettings', this.viewValue);
    this.mainWithInspectorService.changeMessage(null);
  }

  changeSearchedTask(searchValue) {
    this.dataService.changeSearchedTask(searchValue);
  }

  openNewTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: {
        isAddingFromHeader: true,
        allTasks: null,
        showingTasks: null,
        dropLists: null,
        selectedProject: this.selectedProject,
        selectedTeam: this.selectedTeam,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.dataService.changeAddingTask(this.addingTask);
    });
  }


}
