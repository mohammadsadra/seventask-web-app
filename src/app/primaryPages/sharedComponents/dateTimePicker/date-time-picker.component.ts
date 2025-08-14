import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import {fadeInOutAnimation} from 'src/animations/animations';
import {CalendarService} from '../../../services/calendarService/calendar.service';
import {CalendarTypeEnum} from '../../../enums/CalendarTypeEnum';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  animations: [fadeInOutAnimation]
})
export class DateTimePickerComponent implements OnInit, OnChanges {

  @Input() datePicker = true;
  @Input() timePicker = true;
  @Input() havePresets = false;
  @Input() defaultStartDate: moment.Moment = moment(new Date());
  @Input() defaultEndDate: moment.Moment = moment(new Date());
  @Output() selectDates = new EventEmitter<moment.Moment[]>();

  activeTab = 'date';
  showPicker = false;
  rangePicker = true;
  dateOnly = false;
  usedAsDialog: boolean = false;
  enteredValidDatetime = true;
  showingFormat;
  showingDatetimeFormat = 'YYYY/M/D HH:mm';
  showingDateFormat = 'YYYY/M/D';
  selectedDatetimeFormat = 'MMMM D, YYYY HH:mm';
  selectedStartDate = {
    moment: moment(new Date()).set({s: 0, ms: 0}),
    momentString: '',
    hour: 0,
    minute: 0,
    meridian: 'AM'
  };
  selectedEndDate = {
    moment: moment(new Date()).set({s: 0, ms: 0}),
    momentString: '',
    hour: 0,
    minute: 0,
    meridian: 'AM'
  };
  currentDateTime = moment(new Date()).set({h: 0, m: 0, s: 0, ms: 0});
  hours = [
    '1', '2', '3', '4',
    '5', '6', '7', '8',
    '9', '10', '11', '12'
  ];
  minutes = [
    '00', '05', '10', '15',
    '20', '25', '30', '35',
    '40', '45', '50', '55'
  ];

  submittedStartDate: moment.Moment;
  submittedEndDate: moment.Moment;
  submittedStartDateString: string;
  submittedEndDateString: string;

  lastEnteredStartDate: moment.Moment;
  lastEnteredEndDate: moment.Moment;

  selectedDatePreset = 'custom';
  datePresets = [
    new Preset('custom', null, null),
    new Preset('today', 0, 'AM'),
    new Preset('tomorrow', 0, 'AM'),
    new Preset('nextWeek', 0, 'AM'),
    new Preset('nextMonth', 0, 'AM'),
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any,
              private dialogRef: MatDialogRef<DateTimePickerComponent>,
              private calendarService: CalendarService) {
    this.showingFormat = this.showingDatetimeFormat;
    if (inputData.dateTime) {
      this.usedAsDialog = true;
      this.rangePicker = false;
      this.selectedStartDate.moment = moment(this.inputData.dateTime);

      if (inputData.dateOnly) {
        this.dateOnly = true;
        this.showingFormat = this.showingDateFormat;
      }

      this.calendarService.getDateString(this.selectedStartDate.moment, this.selectedDatetimeFormat)
        .then(res => this.selectedStartDate.momentString = res);

      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => {this.submittedStartDateString = res;
        });

      this.selectedEndDate.moment = moment(this.inputData.dateTime);
      this.calendarService.getDateString(this.selectedEndDate.moment, this.selectedDatetimeFormat)
        .then(res => this.selectedEndDate.momentString = res);

      this.updateDateTime(this.selectedStartDate);
      this.updateDateTime(this.selectedEndDate);
    } else if (inputData.startDateTime && inputData.endDateTime) {
      this.usedAsDialog = true;
      this.selectedStartDate.moment = moment(this.inputData.startDateTime);
      this.selectedEndDate.moment = moment(this.inputData.endDateTime);

      this.calendarService.getDateString(this.selectedStartDate.moment, this.selectedDatetimeFormat)
        .then(res => this.selectedStartDate.momentString = res);

      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => {
          this.submittedStartDateString = res;
          this.submittedStartDate = this.selectedStartDate.moment;
        });

      this.calendarService.getDateString(this.selectedEndDate.moment, this.selectedDatetimeFormat)
        .then(res => this.selectedEndDate.momentString = res);

      this.calendarService.getDateString(this.selectedEndDate.moment, this.showingFormat)
        .then(res => {
          this.submittedEndDateString = res;
          this.submittedEndDate = this.selectedEndDate.moment;
        });

      this.updateDateTime(this.selectedStartDate);
      this.updateDateTime(this.selectedEndDate);
    }
  }

  ngOnInit(): void {
    if (this.rangePicker && !(this.inputData.startDateTime && this.inputData.endDateTime)) {
      this.selectedStartDate.moment = this.defaultStartDate === null ? moment(new Date()) : this.defaultStartDate;
      this.calendarService.getDateString(this.selectedStartDate.moment, this.selectedDatetimeFormat)
        .then(res => {
          this.selectedStartDate.momentString = res;
        });

      this.selectedEndDate.moment = this.defaultEndDate === null ? moment(new Date()) : this.defaultEndDate;
      this.calendarService.getDateString(this.selectedEndDate.moment, this.selectedDatetimeFormat)
        .then(res => {
          this.selectedEndDate.momentString = res;
        });

      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => {
          this.submittedStartDateString = res;
          this.submittedStartDate = this.selectedStartDate.moment;
        });
      this.calendarService.getDateString(this.selectedEndDate.moment, this.showingFormat)
        .then(res => {
          this.submittedEndDateString = res;
          this.submittedEndDate = this.selectedEndDate.moment;
        });

      this.updateDateTime(this.selectedStartDate);
      this.updateDateTime(this.selectedEndDate);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      // if (property === 'defaultStartDate' && changes[property].currentValue !== null) {
      //   this.selectedStartDate.moment = changes[property].currentValue;
      //   this.tinyCalendarDefaultSelected = this.selectedStartDate.moment;
      //   this.updateDateTime(this.selectedStartDate);

      // } else if (property === 'defaultEndDate' && changes[property].currentValue !== null) {
      //   this.selectedEndDate.moment = changes[property].currentValue;
      //   this.updateDateTime(this.selectedEndDate);
      // }
    }
  }

  updateDateTime(date) {
    date.hour = CalendarService.convert24FormatToMeridian(date.moment.hour());
    date.minute = date.moment.minute() - date.moment.minute() % 5;
    date.moment.set({m: date.minute, s: 0, ms: 0});
    date.meridian = date.moment.hour() >= 12 ? 'PM' : 'AM';
    this.calendarService.getDateString(date.moment, this.selectedDatetimeFormat)
      .then(res => date.momentString = res);
  }

  changeDateTime(dateToChange: string, amount: string, field: string) {
    let date = dateToChange === 'start' ? this.selectedStartDate : this.selectedEndDate;
    const lastDate = moment(date.moment);
    switch (field) {
      case 'meridian':
        date.moment.set({
          h: date.moment.hour() >= 12 && amount === 'AM' ? date.moment.hour() - 12 :
            (date.moment.hour() < 12 && amount === 'PM' ? date.moment.hour() + 12 : date.moment.hour())
        });
        break;
      case 'hour':
        date.moment.set({
          h: date.meridian === 'PM' ? Number(amount) % 12 + 12 : Number(amount) % 12
        });
        break;
      case 'minute':
        date.moment.set({
          m: Number(amount)
        });
        break;
    }    
    this.updateDateTime(date);
    if (!this.rangePicker) {
      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => this.submittedStartDateString = res);
    } else {
      const minutesDiff = date.moment.diff(lastDate, 'minutes');
      if (dateToChange === 'start') {
        this.selectedEndDate.moment.add(minutesDiff, 'minutes');
        this.updateDateTime(this.selectedEndDate);
      }
    }
    this.selectDates.emit([this.selectedStartDate.moment, this.selectedEndDate.moment]);
  }

  selectedDatesHandler($event: any) {
    this.selectedDatePreset = 'custom';

    this.selectedStartDate.moment.set({y: $event[0].value.getFullYear(), M: $event[0].value.getMonth(), d: $event[0].value.getDate()});
    this.updateDateTime(this.selectedStartDate);

    this.selectedEndDate.moment.set({y: $event[1].value.getFullYear(), M: $event[1].value.getMonth(), d: $event[1].value.getDate()});
    this.updateDateTime(this.selectedEndDate);

    if (!this.rangePicker) {
      this.enteredValidDatetime = true;
      document.getElementById('datetime-input').style.borderColor = '#F0F4F4';
      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => this.submittedStartDateString = res);
    }

    this.selectDates.emit([this.selectedStartDate.moment, this.selectedEndDate.moment]);
  }

  submit() {
    if (this.rangePicker && !this.usedAsDialog) {
      this.showPicker = false;
      this.submittedStartDate = moment(this.selectedStartDate.moment);
      this.submittedEndDate = moment(this.selectedEndDate.moment);      
      this.calendarService.getDateString(this.selectedStartDate.moment, this.showingFormat)
        .then(res => 
          {
            this.submittedStartDateString = res;
            this.calendarService.getDateString(this.selectedEndDate.moment, this.showingFormat)
              .then(res => {
                this.submittedEndDateString = res;
                this.checkRangeSelectionValidation(this.submittedEndDateString, 'end');
              });
          }
          );
    } else if (this.inputData.startDateTime && this.inputData.endDateTime) {
      this.dialogRef.close({
        newStartTime: this.selectedStartDate.moment.toDate(),
        newEndTime: this.selectedEndDate.moment.toDate()
      });
    } else {
      this.dialogRef.close({newDatetime: this.selectedStartDate.moment.toDate()});
    }
  }

  handlePreset(mode: string, preset: Preset) {
    switch (mode) {
      case 'date':
        this.selectedDatePreset = preset.day;
        switch (preset.day) {
          case 'today':
            this.selectedStartDate.moment = moment(new Date()).set({h: 0, m: 0, s: 0, ms: 0});
            this.selectedEndDate.moment = moment(new Date()).set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'tomorrow':
            this.selectedStartDate.moment = moment(new Date()).add(1, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            this.selectedEndDate.moment = moment(new Date()).add(1, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'nextWeek':
            this.selectedStartDate.moment = moment(new Date()).add(7, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            this.selectedEndDate.moment = moment(new Date()).add(7, 'days').set({h: 0, m: 0, s: 0, ms: 0});
            break;
          case 'nextMonth':
            this.selectedStartDate.moment = this.calendarService.addAmountToDate(moment(new Date()), 1, 'month').set({h: 0, m: 0, s: 0, ms: 0});
            this.selectedEndDate.moment = this.calendarService.addAmountToDate(moment(new Date()), 1, 'month').set({h: 0, m: 0, s: 0, ms: 0});
            break;
        }
        this.updateDateTime(this.selectedStartDate);
        this.updateDateTime(this.selectedEndDate);
        break;
    }
  }

  checkRangeSelectionValidation(value, startOrEnd) {
    const mainCalendar = this.calendarService.getMainCalendarType();
    const newDate = mainCalendar === CalendarTypeEnum.GEORGIAN ? moment(value, this.showingFormat, true) :
      moment(jmoment.from(value, 'fa', this.showingFormat).format(this.showingFormat).toString());

    const startField = document.getElementById('start-date-input');
    const endField = document.getElementById('end-date-input');

    let newStartTimeIsValid = true;
    let newEndTimeIsValid = true;

    switch (startOrEnd) {
      case 'start':
        if (newDate.isValid() && this.submittedEndDate.diff(newDate) >= 0) {
          this.submittedStartDate = newDate;
          // this.calendarService.getDateString(newDate, this.showingDatetimeFormat)
          //   .then(res => this.submittedStartDateString = res);
          startField.style.borderColor = '#F0F4F4';
          if (this.lastEnteredEndDate && this.lastEnteredEndDate.diff(this.submittedStartDate) >= 0) {
            endField.style.borderColor = '#F0F4F4';
            this.submittedEndDate = moment(this.lastEnteredEndDate);
            // this.calendarService.getDateString(this.submittedEndDate, this.showingDatetimeFormat)
            // .then(res => this.submittedEndDateString = res);
            this.lastEnteredEndDate = null;
            this.selectedEndDate.moment = this.submittedEndDate;
            this.updateDateTime(this.selectedEndDate);
          }
          this.selectedStartDate.moment = this.submittedStartDate;
          this.updateDateTime(this.selectedStartDate);
        } else {
          if (newDate.isValid()) {
            this.lastEnteredStartDate = newDate;
            this.submittedStartDate = newDate;
          } else {
            newStartTimeIsValid = false;
          }
          startField.style.borderColor = 'red';
        }
        break;
      case 'end':
        if (newDate.isValid() && this.submittedStartDate.diff(newDate) <= 0) {
          this.submittedEndDate = newDate;
          // this.calendarService.getDateString(newDate, this.showingDatetimeFormat)
          //   .then(res => this.submittedEndDateString = res);
          endField.style.borderColor = '#F0F4F4';
          if (this.lastEnteredStartDate && this.submittedEndDate.diff(this.lastEnteredStartDate) >= 0) {
            startField.style.borderColor = '#F0F4F4';
            this.submittedStartDate = moment(this.lastEnteredStartDate);
            // this.calendarService.getDateString(this.submittedStartDate, this.showingDatetimeFormat)
            // .then(res => this.submittedStartDateString = res);
            this.lastEnteredStartDate = null;
            this.selectedStartDate.moment = this.submittedStartDate;
            this.updateDateTime(this.selectedStartDate);
          }
          this.selectedEndDate.moment = this.submittedEndDate;
          this.updateDateTime(this.selectedEndDate);
        } else {

          if (newDate.isValid()) {
            this.lastEnteredEndDate = newDate;
            this.submittedEndDate = newDate;
          } else {
            newEndTimeIsValid = false;
          }
          endField.style.borderColor = 'red';          
        }
        break;
    }

    let dates = [];
    !newEndTimeIsValid ? (!newStartTimeIsValid ? (dates = [null, null]) :
      (dates = [this.submittedStartDate, null])) : (!newStartTimeIsValid ? (dates = [null, this.submittedEndDate]) :
      (dates = [this.submittedStartDate, this.submittedEndDate]));
    this.selectDates.emit(dates);
  }

  onInputChange($event, startOrEnd) {
    const newValue = $event.target.value;
    if (this.rangePicker) {
      this.checkRangeSelectionValidation(newValue, startOrEnd);
    } else {
      const mainCalendar = this.calendarService.getMainCalendarType();
      const newDate = mainCalendar === CalendarTypeEnum.GEORGIAN ? moment(newValue, this.showingFormat, true) :
        moment(jmoment.from(newValue, 'fa', this.showingFormat).format(this.showingFormat).toString());

      const inputField = document.getElementById('datetime-input');
      if (newDate.isValid()) {
        this.enteredValidDatetime = true;
        this.submittedStartDate = newDate;
        this.submittedEndDate = newDate;
        inputField.style.borderColor = '#F0F4F4';
        this.selectedStartDate.moment = this.submittedStartDate;
        this.selectedEndDate.moment = this.submittedStartDate;
        this.updateDateTime(this.selectedStartDate);
        this.updateDateTime(this.selectedEndDate);
      } else {
        this.enteredValidDatetime = false;
        inputField.style.borderColor = 'red';
      }
    }
  }

}

export class Preset {
  public day: string;
  public time: number;
  public meridiem: string;

  constructor(day: string, time: number, meridiem: string) {
    this.day = day;
    this.time = time;
    this.meridiem = meridiem;
  }
}
