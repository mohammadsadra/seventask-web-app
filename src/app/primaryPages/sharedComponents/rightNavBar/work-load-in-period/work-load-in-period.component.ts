import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTimePickerComponent } from '../../dateTimePicker/date-time-picker.component';
import { TimeTrackService } from './../../../../services/timeTrackService/time-track.service';
import { DatePipe } from '@angular/common';
import { DirectionService } from './../../../../services/directionService/direction.service';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { CalendarService } from '../../../../services/calendarService/calendar.service';
import { CalendarTypeEnum } from '../../../../enums/CalendarTypeEnum';

@Component({
  selector: 'app-work-load-in-period',
  templateUrl: './work-load-in-period.component.html',
  styleUrls: ['./work-load-in-period.component.scss'],
})
export class WorkLoadInPeriodComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private timeTrackService: TimeTrackService,
    private datePipe: DatePipe,
    private directionService: DirectionService,
    public calendarService: CalendarService
  ) {}
  /*  */
  showGetWorkloadLoading: boolean;
  isSelected = 'byTeam';
  selectedDate = [];
  checkLess = false;
  degValue = 0.0;
  totalTime = 0;
  clipPath = [];
  workLoads;
  changelocate;
  lastItemPercent;
  dataColor = [
    '#1EC1C3',
    '#F86F8C',
    '#306BDD',
    '#EBAA45',
    '#99ffcc',
    '#cc9966',
    '#a7afbd',
    '#ee4035',
    '#f37736',
    '#fdf498',
    '#7bc043',
    '#0392cf',
    '#4b3832',
    '#854442',
    '#fff4e6',
    '#3c2f2f',
    '#be9b7b',
  ];

  /*  */
  ngOnInit(): void {
    /*  */
    if (
      this.calendarService.getMainCalendarType() === CalendarTypeEnum.GEORGIAN
    ) {
      this.selectedDate = [moment().startOf('month'), moment().endOf('month')];
      this.loadWorkLoad();
    } else if (
      this.calendarService.getMainCalendarType() === CalendarTypeEnum.JALALI
    ) {
      this.selectedDate = [
        jmoment().startOf('jmonth'),
        jmoment().endOf('jmonth'),
      ];
      this.loadWorkLoad();
    }
    this.directionService.currentRotation.subscribe(async (deg) => {
      this.changelocate = localStorage.getItem('languageCode');
    });
  }

  openDatePickerDialog(num) {
    const dialogRef = this.dialog.open(DateTimePickerComponent, {
      data: {
        dateTime: this.selectedDate[num],
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (!res) {
        return;
      }
      this.selectedDate[num] = res.newDatetime;
      if (num === 0) {
        if (moment(this.selectedDate[0]).diff(this.selectedDate[1]) >= 0) {
          this.checkLess = true;
        } else {
          this.checkLess = false;

          this.loadWorkLoad();
        }
      } else if (num === 1) {
        if (moment(this.selectedDate[1]).diff(this.selectedDate[0]) <= 0) {
          this.checkLess = true;
        } else {
          this.checkLess = false;
          this.loadWorkLoad();
        }
      }
    });
  }
  /* load Data for workload */
  loadWorkLoad() {
    /* Variables */
    const dateFormat1 = `${moment(this.selectedDate[0]).format(
      'YYYY-MM-DD'
    )}T00:00:00Z`;
    const dateFormat2 = `${moment(this.selectedDate[1]).format(
      'YYYY-MM-DD'
    )}T23:59:59Z`;
    /*  */
    this.showGetWorkloadLoading = true;
    this.timeTrackService
      .getWorkLoadInPeriod(dateFormat1, dateFormat2)
      .subscribe((res) => {
        this.showGetWorkloadLoading = false;
        this.totalTime = 0;

        this.workLoads = res.value;
        /* total Time */
        this.workLoads.forEach((time) => {
          this.totalTime += time.spentTime;
        });
        /*  */
        if (this.totalTime > 0) {
          this.clipPath = [];
          this.lastItemPercent = 0;
          /* clip path */
          this.workLoads.forEach((time, index) => {
            this.clipPath.push(
              this.clipPathCalc(time.spentTime, this.workLoads.length - index)
            );
          });
        }
      });
  }

  /* clip path calculat */
  clipPathCalc(value, i) {
    /* value round */
    const val = Math.trunc(value);
    const ValFloor = Math.round((value - val) * 100);
    value = val + ValFloor / 100;
    /* total time round */
    const totalZZ = Math.trunc(this.totalTime);
    const totalZZFloor = Math.round((this.totalTime - totalZZ) * 100);
    const totalTime = totalZZ + totalZZFloor / 100;
    /* item percent round */
    const ipercent = (value * 100) / totalTime;
    const ipercentZZ = Math.trunc(ipercent);
    const ipercentZZFloor = Math.round((ipercent - ipercentZZ) * 100);
    let itempercent = ipercentZZ + ipercentZZFloor / 100;

    itempercent += this.lastItemPercent;
    this.lastItemPercent = itempercent;

    if (itempercent === 0 || itempercent < 0) {
      return ['display:none;'];
    } else if (itempercent > 0 && itempercent <= 12.5) {
      /********* Area 1  **********/

      const respersent = (itempercent * 50) / 12.5;
      const riverceRespersent = 50 - respersent;
      const pathClip = `clip-path:polygon(50% 50%,50% 100%,
        ${riverceRespersent}% 100%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (itempercent > 12.5 && itempercent <= 25.0) {
      /********* Area 2  **********/

      const respersent = ((itempercent - 12.5) * 50) / 12.5;
      const riverceRespersent = 100 - respersent;
      const pathClip = `clip-path: polygon(50% 50%,50% 100%,0% 100%,0% 
        ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (itempercent > 25.0 && itempercent <= 37.5) {
      /********* Area 3  **********/

      const respersent = ((itempercent - 25) * 50) / 12.5;
      const riverceRespersent = 50 - respersent;
      const pathClip = `clip-path: polygon(50% 50%,50% 100%,0% 100%,0% 
      ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (itempercent > 37.5 && itempercent <= 50) {
      /********* Area 4  **********/

      const respersent = ((itempercent - 37.5) * 50) / 12.5;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,
        ${respersent}% 0%,50% 50%); z-index:${i}; `;
      return [pathClip, itempercent];
    } else if (itempercent > 50 && itempercent <= 62.5) {
      /********* Area 5  **********/

      const respersent = ((itempercent - 50) * 50) / 12.5;
      const riverceRespersent = 50 + respersent;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,${riverceRespersent}% 0%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (itempercent > 62.5 && itempercent <= 75) {
      /********* Area 6  **********/

      const respersent = ((itempercent - 62.5) * 50) / 12.5;
      const pathClip = `clip-path:polygon(50% 50%, 50% 100%, 0% 100%,0% 0%,100% 0%, 100% ${respersent}%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (itempercent > 75 && itempercent <= 87.5) {
      /********* Area 7  **********/

      const respersent = ((itempercent - 75) * 50) / 12.5;
      const riverceRespersent = respersent + 50;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,100% 0%,100% ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, itempercent];
    } else if (
      (itempercent > 87.5 && itempercent <= 100) ||
      itempercent > 100
    ) {
      /********* Area 8  **********/

      const respersent = 100 - ((itempercent - 87.5) * 50) / 12.5;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%,${respersent}% 100%,50% 50%); z-index:${i};`;
      if (itempercent === 100) {
        return [pathClip, itempercent];
      } else {
        return [pathClip, itempercent];
      }
    }
  }
}
