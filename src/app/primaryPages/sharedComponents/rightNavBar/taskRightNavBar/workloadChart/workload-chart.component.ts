import {
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  HostListener,
} from '@angular/core';
import { MainWithInspectorService } from '../../../../../services/mainWithInspectorService/main-with-inspector.service';
import { TimeService } from '../../../../../services/timeService/time.service';
import { EnglishNumberToArabicNumberPipe } from '../../../../../pipes/english-number-to-arabic-number.pipe';
import { DomainName } from '../../../../../utilities/PathTools';
import { DirectionService } from '../../../../../services/directionService/direction.service';
import { TextDirectionController } from '../../../../../utilities/TextDirectionController';

@Component({
  selector: 'app-workload-chart',
  templateUrl: './workload-chart.component.html',
  styleUrls: ['./workload-chart.component.scss'],
})
export class WorkloadChartComponent implements OnInit {
  iconRotationDegree = TextDirectionController.iconRotationDegree;
  selectedTask;
  showGetWorkloadLoading = true;
  domainName: string = DomainName;
  workLoads;
  totalTime = 0;
  compeletAddTotal = false;
  notShowChart;
  workloadLength = 0;
  clipPath = [];
  innerHeight;
  degValue = 0.0;
  messageTitle;
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

  constructor(
    private mainWithInspectorService: MainWithInspectorService,
    private timeService: TimeService,
    private directionService: DirectionService
  ) {}

  ngOnInit() {
    this.innerHeight = window.innerHeight;
    /* Direction Control */
    this.directionService.currentRotation.subscribe(async (deg) => {
      this.changelocate = localStorage.getItem('languageCode');
    });
    this.mainWithInspectorService.currenttask.subscribe((message) => {
      this.selectedTask = message;
      this.compeletAddTotal = false;
      this.showGetWorkloadLoading = true;
      this.totalTime = 0;
      if (message !== null) {
        this.messageTitle = message.title;
        this.timeService.workLoad(message.id).subscribe((values) => {
          if (this.compeletAddTotal === false) {
            this.workLoads = values.value;
            this.workloadLength = values.value.length;
            this.workLoads.forEach((time) => {
              this.totalTime += time.totalTimeInMinutes;
            });
            this.compeletAddTotal = true;
            this.notShowChart = this.totalTime;
            if (this.totalTime > 0) {
              this.clipPath = [];
              this.lastItemPercent = 0;
              this.workLoads.forEach((time, index) => {
                this.clipPath.push(
                  this.clipPathCalc(
                    time.totalTimeInMinutes,
                    this.workLoads.length - index
                  )
                );
              });
              this.degValue = 0.0;
            }
            this.showGetWorkloadLoading = false;
          }
        });
      } else {
        this.workLoads = null;
      }
    });
    this.workLoads = null;
  }

  /* cilp path calculator */
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
    const percent = ipercentZZ + ipercentZZFloor / 100;
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
      return [pathClip, percent];
    } else if (itempercent > 12.5 && itempercent <= 25.0) {
      /********* Area 2  **********/

      const respersent = ((itempercent - 12.5) * 50) / 12.5;
      const riverceRespersent = 100 - respersent;
      const pathClip = `clip-path: polygon(50% 50%,50% 100%,0% 100%,0% 
        ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, percent];
    } else if (itempercent > 25.0 && itempercent <= 37.5) {
      /********* Area 3  **********/

      const respersent = ((itempercent - 25) * 50) / 12.5;
      const riverceRespersent = 50 - respersent;
      const pathClip = `clip-path: polygon(50% 50%,50% 100%,0% 100%,0% 
      ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, percent];
    } else if (itempercent > 37.5 && itempercent <= 50) {
      /********* Area 4  **********/

      const respersent = ((itempercent - 37.5) * 50) / 12.5;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,
        ${respersent}% 0%,50% 50%); z-index:${i}; `;
      return [pathClip, percent];
    } else if (itempercent > 50 && itempercent <= 62.5) {
      /********* Area 5  **********/

      const respersent = ((itempercent - 50) * 50) / 12.5;
      const riverceRespersent = 50 + respersent;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,${riverceRespersent}% 0%,50% 50%); z-index:${i};`;
      return [pathClip, percent];
    } else if (itempercent > 62.5 && itempercent <= 75) {
      /********* Area 6  **********/

      const respersent = ((itempercent - 62.5) * 50) / 12.5;
      const pathClip = `clip-path:polygon(50% 50%, 50% 100%, 0% 100%,0% 0%,100% 0%, 100% ${respersent}%,50% 50%); z-index:${i};`;
      return [pathClip, percent];
    } else if (itempercent > 75 && itempercent <= 87.5) {
      /********* Area 7  **********/

      const respersent = ((itempercent - 75) * 50) / 12.5;
      const riverceRespersent = respersent + 50;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%,100% 0%,100% ${riverceRespersent}%,50% 50%); z-index:${i};`;
      return [pathClip, percent];
    } else if (
      (itempercent > 87.5 && itempercent <= 100) ||
      itempercent > 100
    ) {
      /********* Area 8  **********/

      const respersent = 100 - ((itempercent - 87.5) * 50) / 12.5;
      const pathClip = `clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%,${respersent}% 100%,50% 50%); z-index:${i};`;
      if (itempercent === 100) {
        return [pathClip, percent];
      } else {
        return [pathClip, percent];
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight;
  }
}

@Pipe({
  name: 'timeInHours',
})
export class MinutesToHours implements PipeTransform {
  toArabicNumPipe = new EnglishNumberToArabicNumberPipe();

  transform(value: any, locate: string) {
    const hours = Math.trunc(value / 60);
    const minuteCalc = Math.trunc(value % 60);
    const minute = minuteCalc < 10 ? '0' + minuteCalc : minuteCalc;
    const minuteP =
      minuteCalc < 10
        ? this.toArabicNumPipe.transform(0) +
          this.toArabicNumPipe.transform(minuteCalc)
        : this.toArabicNumPipe.transform(minuteCalc);
    if (locate === 'en-US') {
      return hours + ':' + minute;
    } else if (locate === 'fa-IR') {
      return this.toArabicNumPipe.transform(hours) + ':' + minuteP;
    } else {
      return hours + ' : ' + minute;
    }
  }
}
