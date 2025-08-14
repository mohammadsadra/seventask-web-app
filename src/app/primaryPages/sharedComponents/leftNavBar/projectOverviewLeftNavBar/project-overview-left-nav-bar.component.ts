import {Component, HostListener, OnInit} from '@angular/core';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {ProjectService} from '../../../../services/projectService/project.service';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {Router} from '@angular/router';
import {DataService} from '../../../../services/dataService/data.service';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';

@Component({
  selector: 'app-project-overview-left-nav-bar',
  templateUrl: './project-overview-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss']
})
export class ProjectOverviewLeftNavBarComponent implements OnInit {

  public activeProject: ProjectDTO;
  activeTab = 'Overview';
  projectNumber;
  height = window.innerHeight;
  direction = TextDirectionController.textDirection;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }
  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              private router: Router,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.currentProject.subscribe(project => {
      if (project != null) {
        this.activeProject = project;
      }
    });
    this.dataService.currentProjectNumber.subscribe(projectNumber => {
      if (projectNumber != null) {
        this.projectNumber = projectNumber;
      }
    });
  }


}
