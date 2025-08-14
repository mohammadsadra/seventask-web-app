import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/projectService/project.service';
import { TeamService } from '../../../../services/teamSerivce/team.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/dataService/data.service';
import { ProjectDTO } from '../../../../DTOs/project/Project';
import { TeamDTO } from '../../../../DTOs/team/Team.DTO';
import { MainWithInspectorService } from '../../../../services/mainWithInspectorService/main-with-inspector.service';
import { TextDirectionController } from '../../../../utilities/TextDirectionController';

@Component({
  selector: 'app-team-overview-left-nav-bar',
  templateUrl: './team-overview-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss'],
})
export class TeamOverviewLeftNavBarComponent implements OnInit {
  public team: TeamDTO;
  activeTab = 'Overview';
  taskNumber;
  height = window.innerHeight - 230;
  direction = TextDirectionController.textDirection;
  showSpinner = true;
  showTeamNameSpinner = true;

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private router: Router,
    private dataService: DataService,
    private mainWithInspectorService: MainWithInspectorService
  ) {}

  ngOnInit(): void {
    this.mainWithInspectorService.currentTeam.subscribe((message) => {
      if (message != null) {
        this.team = message;
        this.showTeamNameSpinner = false;
      }
    });

    this.dataService.currentTeamTaskNumber.subscribe((taskNumber) => {
      if (taskNumber != null) {
        this.taskNumber = taskNumber;
        this.showSpinner = false;
      }
    });
  }

  changeSelectedTab(tabName: string) {
    this.activeTab = tabName;
    this.dataService.changeSelectedTabInTeam(tabName);
  }
}
