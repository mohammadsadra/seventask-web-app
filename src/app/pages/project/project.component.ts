import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProjectService} from '../../services/projectService/project.service';
import {TeamService} from '../../services/teamSerivce/team.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProjectDTO} from '../../DTOs/project/Project';
import {DataService} from '../../services/dataService/data.service';
import {MainWithInspectorService} from '../../services/mainWithInspectorService/main-with-inspector.service';
import {DomainName} from '../../utilities/PathTools';
import {TeamDTO} from '../../DTOs/team/Team.DTO';
import {TranslateService} from '@ngx-translate/core';
import {UserDTO} from '../../DTOs/user/UserDTO';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import { listFade } from 'src/animations/animations';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  animations: [
    listFade,
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({opacity: 0}),
            stagger('200ms', animate('600ms ease-out', style({opacity: 1}))),
          ],
          {optional: true}
        ),
        // query(':leave', animate('170ms', style({opacity: 0})), {
        //   optional: true,
        // }),
      ]),
    ])
  ],
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  // Loading fields
  showGetActiveProjectsLoading = true;
  public activeProjects: Array<ProjectDTO> = [];
  public teams: Array<TeamDTO> = [];
  public data: Array<any> = [];
  projectID = this._Activatedroute.snapshot.paramMap.get('id');
  public viewer = 'all';
  activeTab = 'all';
  personalProjectNumber = 0;
  selectedProject: ProjectDTO;
  domainName = DomainName;

  projectHover = '';

  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              public dialog: MatDialog,
              private router: Router,
              private myService: DataService,
              private _Activatedroute: ActivatedRoute,
              private dataService: DataService,
              private mainWithInspectorService: MainWithInspectorService,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.getTeamsAndProjects();

    this.mainWithInspectorService.changeSelectedProject(null);
    this.mainWithInspectorService.currentProject.subscribe(message => {
    });

    this.dataService.currentProject.subscribe(project => {
      if (project != null) {
        this.activeProjects.splice(0, 0, project);
        if (project.teamId !== null) {
          this.teams.find(x => x.id === project.teamId).numberOfProjects++;
        } else {
          this.personalProjectNumber++;
        }
        this.dataService.changeProject(null);
      }
    });

    if (this.activeTab === 'all') {
      this.dataService.changeProjectTypeViewer('all');
    }
    this.dataService.currentProjectType.subscribe(type => {
      if (type != null) {
        this.viewer = type;
      }
    });
  }


  openProjectOverviewPage(id) {
    this.router.navigateByUrl('project/projectOverview/' + id);
    // [routerLink]="['projectOverview', project.id]"
  }

  getTeamsAndProjects(): void {
    this.teamService.getAllTeam().subscribe(res => {
      this.teams = res;
      this.getActiveProject();
    });
  }

  hexToRgba(hex: string) {

    let c;
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    // tslint:Disable-next-line:no-bitwise
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.1)';
  }


  getActiveProject() {
    this.projectService.getActiveProjects().subscribe(res => {
      this.showGetActiveProjectsLoading = false;
      for (let a = 0; a < res.length; a++) {
        this.activeProjects.push(new ProjectDTO(
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
        ));
        if (res[a].teamId === null) {
          this.personalProjectNumber++;
        }
      }
    });
  }

  public showInspector(id: number): ProjectDTO {
    let selectedProject: ProjectDTO;
    for (const project of this.activeProjects) {
      if (project.id === id) {
        selectedProject = project;
        // console.log(selectedTask);
        this.mainWithInspectorService.changeSelectedProject(project);
        // console.log(project);
        return selectedProject;
      }
    }
    return null;
    // console.log(selectedTask);
  }

}



