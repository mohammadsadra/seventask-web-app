import { Component, HostListener, OnInit } from '@angular/core';
import { ProjectDTO } from '../../../../DTOs/project/Project';
import { ProjectService } from '../../../../services/projectService/project.service';
import { TeamService } from '../../../../services/teamSerivce/team.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/dataService/data.service';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';

@Component({
  selector: 'app-project-left-nav-bar',
  templateUrl: './project-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss'],
})
export class ProjectLeftNavBarComponent implements OnInit {
  // Loading fields
  showTeamsAndProjectsLoading = true;

  public activeProjects: Array<ProjectDTO> = [];
  public teams: Array<any> = [];
  activeTab = 'all';
  height = window.innerHeight;
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
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getTeamsAndProjects();
    this.dataService.currentProject.subscribe((project) => {
      if (project !== null) {
        this.activeProjects.splice(0, 0, project);
        this.dataService.changeProjectNumber(this.activeProjects.length);
      }
    });
    this.dataService.currentProjectNumber.subscribe();
  }

  openAllProject() {
    this.router.navigateByUrl('project');
  }

  openProjectOverview(id) {
    this.router.navigateByUrl('project/projectOverview/' + id);
  }

  getTeamsAndProjects(): void {
    this.teamService.getAllTeam().subscribe((res) => {
      this.teams = res;
      this.getActiveProject();
    });
  }

  changeViewer(type) {
    this.dataService.changeProjectTypeViewer(type);
    this.activeTab = type;
  }

  getActiveProject() {
    this.projectService.getActiveProjects().subscribe((res) => {
      this.showTeamsAndProjectsLoading = false;
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
      this.dataService.changeProjectNumber(this.activeProjects.length);
      this.showSpinner = false;
    });
  }
}
