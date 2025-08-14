import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {CalendarService} from '../../../services/calendarService/calendar.service';
import {CalendarTypeEnum} from '../../../enums/CalendarTypeEnum';

@Component({
  selector: 'app-date-time-range-picker',
  templateUrl: './date-time-range-picker.component.html',
  styleUrls: ['./date-time-range-picker.component.scss']
})
export class DateTimeRangePickerComponent implements OnInit {

  dateFormat = 'YYYY/M/D HH:mm';
  @Input() defaultStartTime: moment.Moment;
  @Input() defaultEndTime: moment.Moment;
  @Output() selectStartTime = new EventEmitter<moment.Moment>();
  @Output() selectEndTime = new EventEmitter<moment.Moment>();

  datetimeSelector = null;
  selectedStartTime: moment.Moment;
  selectedEndTime: moment.Moment;
  selectedStartTimeString: string;
  selectedEndTimeString: string;

  constructor(private snackBar: MatSnackBar,
              private translate: TranslateService,
              private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.selectedStartTime = this.defaultStartTime;
    this.selectedEndTime = this.defaultEndTime;
    this.calendarService.getDateString(this.selectedStartTime, this.dateFormat).then(res => this.selectedStartTimeString = res);
    this.calendarService.getDateString(this.selectedEndTime, this.dateFormat).then(res => this.selectedEndTimeString = res);
  }

  async selectDate(date: moment.Moment) {
    switch (this.datetimeSelector) {
      case 'start':
        this.selectedStartTime = date;
        this.calendarService.getDateString(this.selectedStartTime, this.dateFormat).then(res => this.selectedStartTimeString = res);
        this.selectStartTime.emit(this.selectedStartTime);
        break;
      case 'end':
        this.selectedEndTime = date;
        this.calendarService.getDateString(this.selectedEndTime, this.dateFormat).then(res => this.selectedEndTimeString = res);
        this.selectEndTime.emit(this.selectedEndTime);
        break;
    }
    this.datetimeSelector = null;
  }

  async onInputChange($event, startOrEnd) {
    const newValue = $event.target.value;
    const mainCalendar = this.calendarService.getMainCalendarType();
    const newDate = mainCalendar === CalendarTypeEnum.GEORGIAN ? moment(newValue) :
      moment(jmoment.from(newValue, 'fa', this.dateFormat).format(this.dateFormat).toString());
    switch (startOrEnd) {
      case 'start':
        const startField = document.getElementById('startTime-input');
        if (newDate.isValid()) {
          this.selectedStartTime = newDate;
          startField.style.borderColor = '#F0F4F4';
        } else {
          this.selectedStartTime = null;
          startField.style.borderColor = 'red';
        }
        this.selectStartTime.emit(this.selectedStartTime);
        break;
      case 'end':
        const endField = document.getElementById('endTime-input');
        if (newDate.isValid()) {
          this.selectedEndTime = newDate;
          endField.style.borderColor = '#F0F4F4';
        } else {
          this.selectedEndTime = null;
          endField.style.borderColor = 'red';
        }
        this.selectEndTime.emit(this.selectedEndTime);
        break;
    }
  }

}
