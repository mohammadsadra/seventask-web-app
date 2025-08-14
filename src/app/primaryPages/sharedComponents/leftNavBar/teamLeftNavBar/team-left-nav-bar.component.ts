import { Component, HostListener, OnInit } from '@angular/core';
import { ProjectDTO } from '../../../../DTOs/project/Project';
import { ProjectService } from '../../../../services/projectService/project.service';
import { TeamService } from '../../../../services/teamSerivce/team.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/dataService/data.service';
import { DepartmentService } from '../../../../services/departmentService/department.service';
import { DepartmentDTO } from '../../../../DTOs/department/DepartmentDTO';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';

@Component({
  selector: 'app-team-left-nav-bar',
  templateUrl: './team-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss'],
})
export class TeamLeftNavBarComponent implements OnInit {
  // Loading fields
  showTeamsAndDepartmentsLoading = true;

  public allDepartments: Array<DepartmentDTO> = [];
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
    private departmentService: DepartmentService,
    private teamService: TeamService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getTeamsAndDepartments();
    // this.dataService.currentProject.subscribe(project => {
    //   if (project != null) {
    //     this.activeProjects.splice(0, 0, project);
    //     this.dataService.changeProjectNumber(this.activeProjects.length);
    //   }
    // });
    // this.dataService.currentProjectNumber.subscribe();
    this.dataService.currentTeam.subscribe((team) => {
      if (team != null) {
        this.teams.push(team);
      }
    });
  }

  // openAllProject() {
  //   this.router.navigateByUrl('project');
  // }

  // openProjectOverview(id) {
  //   this.router.navigateByUrl('project/projectOverview/' + id);
  // }

  getTeamsAndDepartments(): void {
    this.teamService.getAllTeam().subscribe((res) => {
      this.teams = res;
      if (this.teams !== null) {
        this.showSpinner = false;
      }
      this.getDepartments();
    });
  }

  // changeViewer(type) {
  //   this.dataService.changeProjectTypeViewer(type);
  //   this.activeTab = type;
  // }

  getDepartments() {
    this.departmentService.getAllDepartment().subscribe((res) => {
      this.showTeamsAndDepartmentsLoading = false;
      this.allDepartments = res;
    });
  }

  openTeamOverviewPage(id) {
    this.router.navigateByUrl('team/teamOverview/' + id);
    // [routerLink]="['projectOverview', project.id]"
  }
}
