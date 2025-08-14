import {Component, HostListener, OnInit} from '@angular/core';
import {ProjectDTO} from '../../../../DTOs/project/Project';
import {ProjectService} from '../../../../services/projectService/project.service';
import {TeamService} from '../../../../services/teamSerivce/team.service';
import {Router} from '@angular/router';
import {DataService} from '../../../../services/dataService/data.service';
import {TextDirectionController} from '../../../../utilities/TextDirectionController';
import { CalendarDataService } from 'src/app/services/dataService/calendarDataService/calendar-data.service';
import {GoogleCalendarModel} from '../../../../DTOs/calendar/GoogleCalendarModel';
import { fadeInOutAnimation, listAnimation } from 'src/animations/animations';

@Component({
  selector: 'app-calendar-left-nav-bar',
  templateUrl: './calendar-left-nav-bar.component.html',
  styleUrls: ['../SCSS/left-nav-style.scss'],
  animations: [ fadeInOutAnimation, listAnimation ]
})
export class CalendarLeftNavBarComponent implements OnInit {

  public eventsNumber: number = 0;
  public activeProjects: Array<ProjectDTO> = [];
  public teams: Array<any> = [];
  googleCalendars: GoogleCalendarModel[] = [];
  googleCalendarsColorPalette = [
    '#5344a9',
    '#51975a',
    '#bb5098',
    '#f47f6b',
    '#f5c63c'
  ];
  activeTab = 'all';
  height = window.innerHeight;
  direction = TextDirectionController.textDirection;
  showTeamsAndProjectsLoading = true;
  showGoogleCalendars = true;
  showGoogleCalendarMapper = {};

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = event.target.innerHeight;
  }

  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              private router: Router,
              private calendarDataService: CalendarDataService) {
  }

  ngOnInit(): void {
    this.calendarDataService.getNumberOfEventsObservable.subscribe(result => {
      if (result) {
        this.eventsNumber = result.numberOfTasks + result.numberOfEvents;
      }
    });
    this.calendarDataService.getGoogleCalendarsList.subscribe((result) => {
      if (result) {
        const newCalendars = result.filter(googleCalendar => {
          return !this.googleCalendars.some(calendar => calendar.id === googleCalendar.id);
        });
        for (let googleCalendar of newCalendars) {
          this.showGoogleCalendarMapper[googleCalendar.id] = true;
          this.googleCalendars.push(googleCalendar);
        }
      }
    });
    this.getTeamsAndProjects();
  }

  matCheckBoxEvent(show, calendarId) {
    this.showGoogleCalendarMapper[calendarId] = !this.showGoogleCalendarMapper[calendarId];
    this.calendarDataService.updateGoogleCalendarShowingStatus(show, calendarId);
  }

  openAllProject() {
    // this.router.navigateByUrl('project');
  }

  openProjectOverview(id) {
    this.router.navigateByUrl('project/projectOverview/' + id);
  }

  getTeamsAndProjects(): void {
    this.teamService.getAllTeam().subscribe(res => {
      this.teams = res;
      this.getActiveProject();
    });
  }

  changeViewer(type) {
    // this.dataService.changeProjectTypeViewer(type);
    this.activeTab = type;
  }

  getActiveProject() {
    this.projectService.getActiveProjects().subscribe(res => {
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
      }
      this.showTeamsAndProjectsLoading = false;
    });
  }

}
