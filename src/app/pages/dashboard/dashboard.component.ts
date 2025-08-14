import { Component, OnInit, Input, HostListener } from '@angular/core';
import { JWTTokenService } from '../../services/accountService/jwttoken.service';
import { KanbanService } from '../../services/kanbanService/kanban.service';
import { ProjectService } from '../../services/projectService/project.service';
import { TeamService } from '../../services/teamSerivce/team.service';
import { DomainName } from '../../utilities/PathTools';
import { CalendarDay, CalendarService } from '../../services/calendarService/calendar.service';
import * as moment from 'moment';
import * as $ from 'jquery';
import { DirectionService } from '../../services/directionService/direction.service';
import { CalendarTypeEnum } from '../../enums/CalendarTypeEnum';
import { ThemePalette } from '@angular/material/core';
import { ChatService } from '../../services/chatService/chat.service';
import { EventResponseModel } from 'src/app/DTOs/calendar/EventResponseModel';
import { CalendarApiService } from 'src/app/services/calendarService/calendarAPI/calendar-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  matSpinnercolor: ThemePalette = 'accent';
  userNickName;
  archivedTasks;
  projectNum;
  teamsNum;
  chatNum;
  UrgentTasks;
  UrgentTasksLenght;
  /* */
  projectbool = true;
  teamsbool = true;
  tasksbool = true;
  chatbool = true;
  Urgentbool = true;
  /**/
  UrgentNoData = true;
  animationOn = [];
  domainName: string = DomainName;
  proioritiyNumber;
  pathClipLow;
  pathClipMedium;
  pathClipHigh;
  numOfLow: number;
  numOfMedium: number;
  numOfHigh: number;
  selectedDate = moment(new Date());
  visibleDates = [];
  daysNames;
  changelocate;
  mainCalendar;
  alternativeCalendar;
  alternativeIsEnable;
  alternativeMonthNameEN = [];
  monthEvents: EventResponseModel[] = [];
  todayDate = moment(new Date());
  gotEvents = false;
  noEvents = true;
  googleCalendarsColorPalette = [
    '#5344a9',
    '#51975a',
    '#bb5098',
    '#f47f6b',
    '#f5c63c'
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkInfoBoxHeight();
  }

  constructor(
    private jwtTokenService: JWTTokenService,
    private kanbanService: KanbanService,
    private projectService: ProjectService,
    private calendarService: CalendarService,
    private calendarApiService: CalendarApiService,
    private directionService: DirectionService,
    private chatService: ChatService,
    private teamService: TeamService
  ) {
  }

  ngOnInit() {
    // updating today each 1 minute.
    setTimeout( () => {
      this.todayDate = moment(new Date());
      setInterval( () => {
        if (this.todayDate.day() != moment(new Date()).day()) {
          this.todayDate = moment(new Date());
          // this.fillEvents();
        }
        this.todayDate = moment(new Date());
      }, 60000);
    }, 60000 - (this.todayDate.seconds() * 1000 + this.todayDate.milliseconds()));

    this.fillVisibleEvents();
  
    if (
      this.calendarService.getMainCalendarType() === CalendarTypeEnum.GEORGIAN
    ) {
      this.mainCalendar = 'GE';
      this.alternativeCalendar = 'JA';
    } else if (
      this.calendarService.getMainCalendarType() === CalendarTypeEnum.JALALI
    ) {
      this.mainCalendar = 'JA';
      this.alternativeCalendar = 'GE';
    }

    this.directionService.currentRotation.subscribe(async (deg) => {
      this.changelocate = localStorage.getItem('languageCode');
    });

    this.userNickName = this.jwtTokenService.getUserNickName();
    this.kanbanService.getNumberOfTasks().subscribe((res) => {
      this.archivedTasks = res;
      this.tasksbool = false;
      this.checkInfoBoxHeight();
    });

    this.kanbanService.getUrgentTasks().subscribe((res) => {
      this.UrgentTasks = res;
      this.UrgentTasksLenght = res.length;
      this.Urgentbool = false;

      if (this.UrgentTasksLenght > 0) {
        this.UrgentNoData = false;
      }
    });

    this.projectService.getNumberOfActiveProjects().subscribe((res) => {
      this.projectNum = res;
      this.projectbool = false;
      this.checkInfoBoxHeight();
    });

    this.teamService.getNumberOfTeams().subscribe((res) => {
      this.teamsNum = res;
      this.teamsbool = false;
      this.checkInfoBoxHeight();
    });

    this.chatService.getNumberOfUnreadMessages().subscribe((result) => {
      this.chatNum = result;
      this.chatbool = false;
      this.checkInfoBoxHeight();
    });

    this.kanbanService
      .getNumberOfTasksInEachProioritiy()
      .subscribe(async (res) => {
        this.pathClipLow = await this.pathClipClac(res[0], this.archivedTasks);
        this.numOfLow = res[0].taskNumber;
        this.pathClipMedium = await this.pathClipClac(
          res[1],
          this.archivedTasks
        );
        this.numOfMedium = res[1].taskNumber;
        this.pathClipHigh = await this.pathClipClac(res[2], this.archivedTasks);
        this.numOfHigh = res[2].taskNumber;
      });

  }
  activeAnimation(item) {
    this.animationOn[item] = true;
  }

  checkInfoBoxHeight() {
    $(document).ready(function() {
      $.each($('.info-Box'), function(){
        var height = 0;
        $.each($(this).children(), function() {            
          if (!this.classList.contains('info-box-icon')) {        
            height += $(this).outerHeight(true);
          }
        })
        $(this).height(height + 85);
      });
    });​
  }

  pathClipClac(value, taskNum) {
    const itemTaskNumber = value.taskNumber;
    const itempercent = Math.round((itemTaskNumber * 100) / taskNum);
    if (itempercent === 0) {
      return 'polygon(50% 50%,50% 100%,100% 100%,100% 0%,0% 0%,0% 100%,49% 100%,50% 50%)';
    } else if (itempercent > 0 && itempercent <= 12.5) {
      /********* Area 1  **********/
      const respersent = (itempercent * 50) / 12.5;
      const riverceRespersent = 50 - respersent;
      const pathClip =
        'polygon(50% 50%,50% 100%,100% 100%,100% 0%,0% 0%,0% 100%,' +
        Math.round(riverceRespersent) +
        '% 100%,50% 50%)';
      return pathClip;
    } else if (itempercent > 12.5 && itempercent <= 25) {
      /********* Area 2  **********/
      const respersent = ((itempercent - 12.5) * 50) / 12.5;
      const riverceRespersent = 100 - respersent;
      const pathClip =
        'polygon(50% 50%,50% 100%,100% 100%,100% 0%,0% 0%,0% 50%,0%' +
        Math.round(riverceRespersent) +
        '%,50% 50%)';
      return pathClip;
    } else if (itempercent > 25 && itempercent <= 37.5) {
      /********* Area 3  **********/
      const respersent = ((itempercent - 25) * 50) / 12.5;
      const riverceRespersent = 50 - respersent;
      const pathClip =
        'polygon(50% 50%,50% 100%,100% 100%,100% 0%,0% 0%,0% ' +
        Math.round(riverceRespersent) +
        '%,50% 50%)';
      return pathClip;
    } else if (itempercent > 37.5 && itempercent <= 50) {
      /********* Area 4  **********/
      const respersent = ((itempercent - 37.5) * 50) / 12.5;
      const pathClip =
        'polygon(50% 50%, 50% 100%, 100% 100%, 100% 0%,' +
        Math.round(respersent) +
        '% 0%,50% 50%)';
      return pathClip;
    } else if (itempercent > 50 && itempercent <= 62.5) {
      /********* Area 5  **********/
      const respersent = ((itempercent - 50) * 50) / 12.5;
      const riverceRespersent = respersent + 50;
      const pathClip =
        'polygon(50% 50%, 50% 100%, 100% 100%, 100% 0%,' +
        Math.round(riverceRespersent) +
        '% 0%,50% 50%)';
      return pathClip;
    } else if (itempercent > 62.5 && itempercent <= 75) {
      /********* Area 6  **********/
      const respersent = ((itempercent - 62.5) * 50) / 12.5;
      const pathClip =
        'polygon(50% 50%, 50% 100%, 100% 100%, 100% ' +
        Math.round(respersent) +
        '%,50% 50%)';
      return pathClip;
    } else if (itempercent > 75 && itempercent <= 87.5) {
      /********* Area 7  **********/
      const respersent = ((itempercent - 75) * 50) / 12.5;
      const riverceRespersent = respersent + 50;
      const pathClip =
        'polygon(50% 50%, 50% 100%, 100% 100%, 100% ' +
        Math.round(riverceRespersent) +
        '%,50% 50%)';
      return pathClip;
    } else if (itempercent > 87.5 && itempercent <= 100) {
      /********* Area 8  **********/
      const respersent = ((itempercent - 87.5) * 50) / 12.5;
      const riverceRespersent = 100 - respersent;
      const pathClip =
        'polygon(50% 50%, 50% 100%,' +
        Math.round(riverceRespersent) +
        '% 100%,50% 50%)';
      return pathClip;
    }
  }

  fillVisibleEvents() {
    const startDate = moment(this.todayDate).add(-1, 'days');
    const endDate = moment(startDate).add(1, 'months');

    this.calendarApiService
      .getEventsInPeriod(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'))
      .subscribe((events) => {
        while (startDate.diff(endDate, 'day') !== 0) {
          this.visibleDates.push(new CalendarDay(moment(startDate.add(1, 'day')), true));
        }
        if (events.value.googleCalendarsEvents) {
          for (let i = 0; i < events.value.googleCalendarsEvents.length; i++) {
            for (let j = 0; j < events.value.googleCalendarsEvents[i].googelEvents.length; j++) {
              const tempEvent = events.value.googleCalendarsEvents[i].googelEvents[j];
              tempEvent.color = this.googleCalendarsColorPalette[i % 5];
              events.value.sevenTaskEvents.push(tempEvent);
            }
          }
        } 
        this.monthEvents = [].concat.apply([], this.calendarService.getEachDayEvents(events.value.sevenTaskEvents, this.visibleDates));
        this.monthEvents.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());        
        this.gotEvents = true;
        this.noEvents = this.monthEvents.length === 0;
      });
  }

  hexToRgbA(hex, opacity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // tslint:disable-next-line:no-bitwise
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
  }
}
