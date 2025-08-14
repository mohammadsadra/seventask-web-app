import {Component, HostListener, OnInit} from '@angular/core';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {ProjectService} from '../../../../services/projectService/project.service';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {Router} from '@angular/router';
import {DataService} from '../../../../services/dataService/data.service';
import {GeneralTaskDTO} from '../../../../DTOs/kanban/GeneralTaskDTO';
import {TeamDTO} from '../../../../DTOs/team/Team.DTO';
import {MainWithInspectorService} from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import {KanbanSettingsDTO} from '../../../../DTOs/kanban/KanbanSettingsDTO';
import {listAnimation, fadeInOutAnimation} from '../../../../../animations/animations';
import {HttpEvent} from '@angular/common/http';

@Component({
  selector: 'app-task-left-nav-bar',
  templateUrl: './task-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss'],
  animations: [listAnimation, fadeInOutAnimation]
})
export class TaskLeftNavBarComponent implements OnInit {
  // Loading fields
  showGetTeamsAndProjectsLoading = true;
  getTaskApisFinished = false;
  getLeftNavBarApisFinished = false;
  isGanttSelected = false;

  public activeProjects: Array<ProjectDTO> = [];
  public teams: Array<any> = [];
  public selectedProject: ProjectDTO;
  public selectedTeam: TeamDTO;
  public selectedTask: GeneralTaskDTO;
  public projectsTasks = {};
  public projectsNoDateTasks = {};
  public teamsWithoutProjectsTasks = {};
  public teamsWithoutProjectsNoDateTasks = {};
  public showTasksOfProject = {};
  public showNoDateTasksOfProject = {};
  public showTasksOfTeam = {};
  public showNoDateTasksOfTeam = {};
  public tasksInfo = {};
  public projectColors = {
    null: '306BDD'
  };
  public teamsColors = {};
  public showingTasks: GeneralTaskDTO[];
  public taskNumber: number;
  public activeTab;
  isPersonalSelected: boolean;
  isPersonalProjectSelected: boolean;
  isAllTasksSelected: boolean;
  height = window.innerHeight;
  viewValue: string;
  direction = TextDirectionController.textDirection;
  showSpinner = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private router: Router,
    private dataService: DataService,
    private mainWithInspectorService: MainWithInspectorService
  ) {
  }

  ngOnInit(): void {
    this.dataService.getTasks.subscribe(tasks => {
      if (tasks) {
        this.projectsTasks = {};
        this.projectsNoDateTasks = {};
        this.teamsWithoutProjectsTasks = {};
        this.teamsWithoutProjectsNoDateTasks = {};
        this.tasksInfo = [];
        this.showingTasks = [];
        for (let i = 0; i < tasks.length; i++) {
          this.projectsTasks[tasks[i].projectId] = [];
          this.projectsNoDateTasks[tasks[i].projectId] = [];
          this.teamsWithoutProjectsTasks[tasks[i].teamId] = [];
          this.teamsWithoutProjectsNoDateTasks[tasks[i].teamId] = [];
        }
        for (let task of tasks) {
          if (this.showTasksOfProject[task.projectId] === undefined) {
            this.showTasksOfProject[task.projectId] = false;
          }
          if (this.showNoDateTasksOfProject[task.projectId] === undefined) {
            this.showNoDateTasksOfProject[task.projectId] = false;
          }
          if (this.showTasksOfTeam[task.teamId] === undefined) {
            this.showTasksOfTeam[task.teamId] = false;
          }
          if (this.showNoDateTasksOfTeam[task.teamId] === undefined) {
            this.showNoDateTasksOfTeam[task.teamId] = false;
          }
          if (task.startDate && task.endDate) {
            if (task.teamId === null) {
              this.projectsTasks[task.projectId].push(task);
            } else {
              if (task.projectId !== null) {
                this.projectsTasks[task.projectId].push(task);
              } else {
                this.teamsWithoutProjectsTasks[task.teamId].push(task);
              }
            }
          } else {
            if (task.teamId === null) {
              this.projectsNoDateTasks[task.projectId].push(task);
            } else {
              if (task.projectId !== null) {
                this.projectsNoDateTasks[task.projectId].push(task);
              } else {
                this.teamsWithoutProjectsNoDateTasks[task.teamId].push(task);
              }
            }
          }
        }
        if (this.isGanttSelected) {
          this.scrollHandler(null);
        }
        this.activeProjects.forEach(project => {
          this.projectColors[project.id] = project.color;
        });
        this.teams.forEach(team => {
          this.teamsColors[team.id] = team.color;
        });
      }
    });
    this.dataService.currentMessage.subscribe(msg => {
      if (msg) {
        this.isGanttSelected = msg === 'Gantt' ? true : false;
      }
    });
    this.dataService.currentGetTaskApisFinished.subscribe((message) => {
      this.getTaskApisFinished = message;
      if (this.getTaskApisFinished && this.getLeftNavBarApisFinished) {
        // console.log(localStorage.getItem('kanbanSettings'));
        if (localStorage.getItem('kanbanSettings') == null) {
          localStorage.setItem(
            'kanbanSettings',
            JSON.stringify(
              new KanbanSettingsDTO(null, null, true, false, false)
            )
          );
          this.openPersonalTasks();
          this.activeTab = 'personal-Tasks';
        } else {
          const kanbanSettings: KanbanSettingsDTO = JSON.parse(
            localStorage.getItem('kanbanSettings')
          );
          if (kanbanSettings.isAllTasksSelected) {
            this.openAllTasks();
            this.activeTab = 'all';
          } else if (kanbanSettings.isPersonalSelected) {
            this.openPersonalTasks();
            this.activeTab = 'personal-Tasks';
          } else if (kanbanSettings.isPersonalProjectsSelected) {
            this.openPersonalProjectTasks();
            this.activeTab = 'personal';
          } else if (
            kanbanSettings.selectedProject != null &&
            this.activeProjects.some(
              (p) => p.id.toString() === kanbanSettings.selectedProject.id.toString()
            )
          ) {
            this.openProjectTasks(kanbanSettings.selectedProject);
            this.activeTab =
              kanbanSettings.selectedProject.id.toString() + 'project';
            // console.log(kanbanSettings.selectedProject);
          } else if (
            kanbanSettings.selectedTeam != null &&
            this.teams.some((t) => t.id.toString() === kanbanSettings.selectedTeam.id.toString())
          ) {
            // console.log(kanbanSettings.selectedTeam);
            this.openTeamTasks(kanbanSettings.selectedTeam);
            this.activeTab = kanbanSettings.selectedTeam.id.toString();
          } else {
            localStorage.setItem(
              'kanbanSettings',
              JSON.stringify(
                new KanbanSettingsDTO(null, null, true, false, false)
              )
            );
            this.openPersonalTasks();
            this.activeTab = 'personal-Tasks';
          }
        }
      } else {
        // console.log('Balanesbat');
      }
    });

    this.dataService.currentIsAllTasksSelected.subscribe((message) => {
      this.isAllTasksSelected = message;
    });

    this.dataService.currentIsPersonalProjectSelected.subscribe((message) => {
      this.isPersonalProjectSelected = message;
    });

    this.dataService.currentIsPersonalSelected.subscribe((message) => {
      this.isPersonalSelected = message;
    });

    this.dataService.currentTaskNumber.subscribe((message) => {
      this.taskNumber = message;
      if (this.taskNumber !== null) {
        this.showSpinner = false;
      }
    });

    this.dataService.currentProjectTasks.subscribe((message) => {
      this.selectedProject = message;
    });

    this.dataService.currentTeamTasks.subscribe((message) => {
      this.selectedTeam = message;
    });

    this.mainWithInspectorService.currenttask.subscribe((message) => {
      this.selectedTask = message;
    });

    this.getTeamsAndProjects();
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    if (this.isGanttSelected) {
      for (let projectId in this.showTasksOfProject) {
        if (this.showTasksOfProject[projectId]) {
          this.updateShowingTimelinesOfProjects(projectId, true);
        }
      }
      for (let teamId in this.showTasksOfTeam) {
        if (this.showTasksOfTeam[teamId]) {
          this.updateShowingTimelinesOfTeams(teamId, true);
        }
      }
    }
  }

  updateTimelinesOffset(scrolled: boolean = false) {
    setTimeout(() => {
      this.tasksInfo = {};
      if (document.getElementById('left-panel') === null) {
        return;
      }
      const tasksHtmlElement = document.getElementById('left-panel').getElementsByClassName('task-title');
      for (let i = 0; i < tasksHtmlElement.length; i++) {
        for (let task of this.showingTasks) {
          if (task.id == Number(tasksHtmlElement[i].id)) {
            this.tasksInfo[task.id] = {
              offset: tasksHtmlElement[i].getBoundingClientRect(),
              color: task.projectId === null && task.teamId !== null ? this.teamsColors[task.teamId] : this.projectColors[task.projectId]
            };
            break;
          }
        }
      }
      this.dataService.updateOffsets({
        tasksInfo: this.tasksInfo,
        scrolled: scrolled
      });
    }, 1);
  }

  updateShowingTimelinesOfProjects(projectId, scrolled: boolean = false) {
    setTimeout(() => {
      if (this.showTasksOfProject[projectId]) {
        if (this.projectsTasks[projectId]) {
          for (let task of this.projectsTasks[projectId]) {
            this.showingTasks.push(task);
          }
        }
        if (this.projectsNoDateTasks[projectId]) {
          for (let task of this.projectsNoDateTasks[projectId]) {
            this.showingTasks.push(task);
          }
        }
      } else {
        this.showingTasks = this.showingTasks.filter(task => task.projectId !== projectId);
      }
      this.updateTimelinesOffset(scrolled);
    }, 1);
  }

  updateShowingTimelinesOfTeams(teamId, scrolled: boolean = false) {
    setTimeout(() => {
      if (this.showTasksOfTeam[teamId]) {
        if (this.teamsWithoutProjectsTasks[teamId]) {
          for (let task of this.teamsWithoutProjectsTasks[teamId]) {
            this.showingTasks.push(task);
          }
        }
        if (this.teamsWithoutProjectsNoDateTasks[teamId]) {
          for (let task of this.teamsWithoutProjectsNoDateTasks[teamId]) {
            this.showingTasks.push(task);
          }
        }
      } else {
        this.showingTasks = this.showingTasks.filter(task => !(task.projectId === null && task.teamId === teamId));
      }
      this.updateTimelinesOffset(scrolled);
    }, 1);
  }

  openAllTasks(event?: any) {
    if (event?.ctrlKey) {
      window.open('/todo?isAllTasksSelected=true', '_blank');
      return;
    }
    this.activeTab = 'all';
    this.mainWithInspectorService.changeMessage(null);
    this.dataService.changeProjectTasks(null);
    this.dataService.changeTeamTasks(null);
    this.dataService.changeIsPersonalSelected(false);
    this.dataService.changeIsPersonalProjectsSelected(false);
    this.dataService.changeIsAllTasksSelected(true);
    // this.dataService.changeMessage('List');
    localStorage.setItem(
      'kanbanSettings',
      JSON.stringify(new KanbanSettingsDTO(null, null, false, false, true))
    );
    // this.router.navigateByUrl('kanban');
  }

  openPersonalTasks(event?: any) {
    if (event?.ctrlKey) {
      window.open('/todo?isPersonalSelected=true', '_blank');
      return;
    }
    this.activeTab = 'personal-Tasks';
    this.mainWithInspectorService.changeMessage(null);
    this.dataService.changeProjectTasks(null);
    this.dataService.changeTeamTasks(null);
    this.dataService.changeIsPersonalProjectsSelected(false);
    this.dataService.changeIsAllTasksSelected(false);
    this.dataService.changeIsPersonalSelected(true);
    localStorage.setItem(
      'kanbanSettings',
      JSON.stringify(new KanbanSettingsDTO(null, null, true, false, false))
    );
  }

  openPersonalProjectTasks(event?: any) {
    if (event?.ctrlKey) {
      window.open('/todo?isPersonalProjectsSelected=true', '_blank');
      return;
    }
    this.activeTab = 'personal';
    this.mainWithInspectorService.changeMessage(null);
    this.dataService.changeProjectTasks(null);
    this.dataService.changeTeamTasks(null);
    this.dataService.changeIsPersonalSelected(false);
    this.dataService.changeIsPersonalProjectsSelected(true);
    // this.dataService.changeMessage('List');
    localStorage.setItem(
      'kanbanSettings',
      JSON.stringify(new KanbanSettingsDTO(null, null, false, true, false))
    );
    // this.router.navigateByUrl('kanban');
  }

  openProjectTasks(project: ProjectDTO, event?: any) {
    if (event?.ctrlKey) {
      window.open('/todo?projectId=' + project.id, '_blank');
      return;
    }
    this.activeTab = project.id.toString() + 'project';
    this.mainWithInspectorService.changeMessage(null);
    this.dataService.changeTeamTasks(null);
    this.dataService.changeIsPersonalProjectsSelected(false);
    this.dataService.changeIsPersonalSelected(false);
    this.dataService.changeIsAllTasksSelected(false);
    this.dataService.changeProjectTasks(project);
    localStorage.setItem(
      'kanbanSettings',
      JSON.stringify(new KanbanSettingsDTO(project, null, false, false, false))
    );
    // this.router.navigateByUrl('kanban');
  }

  openTeamTasks(team: TeamDTO, event?: any) {
    if (event?.ctrlKey) {
      window.open('/todo?teamId=' + team.id, '_blank');
      return;
    }
    this.activeTab = team.id.toString();
    this.mainWithInspectorService.changeMessage(null);
    this.dataService.changeProjectTasks(null);
    this.dataService.changeIsPersonalProjectsSelected(false);
    this.dataService.changeIsPersonalSelected(false);
    this.dataService.changeIsAllTasksSelected(false);
    this.dataService.changeTeamTasks(team);
    localStorage.setItem(
      'kanbanSettings',
      JSON.stringify(new KanbanSettingsDTO(null, team, false, false, false))
    );
    // this.router.navigateByUrl('kanban');
  }

  getTeamsAndProjects(): void {
    this.teamService.getAllTeam().subscribe((res) => {
      this.teams = res;
      this.getActiveProject();
    });
  }

  getActiveProject() {
    this.projectService.getActiveProjects().subscribe((res) => {
      this.showGetTeamsAndProjectsLoading = false;
      for (let a = 0; a < res.length; a++) {
        this.activeProjects.push(
          new ProjectDTO(
            res[a].id,
            res[a].guid,
            res[a].name,
            res[a].description,
            res[a].statusId,
            res[a].numberOfUpdates,
            res[a].startDate,
            res[a].endDate,
            res[a].createdBy,
            res[a].modifiedBy,
            res[a].createdOn,
            res[a].modifiedOn,
            res[a].color,
            res[a].teamId,
            res[a].teamName,
            res[a].users,
            res[a].departmentId,
            res[a].projectImageId,
            res[a].numberOfTasks,
            res[a].spentTimeInMinutes
          )
        );
      }
      this.getLeftNavBarApisFinished = true;
      // setTimeout(() => {
      //
      // }, 0);
      // this.dataService.changeIsAllTasksSelected(kanbanSettings.isAllTasksSelected);
      // this.dataService.changeIsPersonalProjectsSelected(kanbanSettings.isPersonalProjectsSelected);
      // this.dataService.changeIsPersonalSelected(kanbanSettings.isPersonalSelected);
      // this.dataService.changeProjectTasks(kanbanSettings.selectedProject);
      // this.dataService.changeTeamTasks(kanbanSettings.selectedTeam);
    });
  }
}
