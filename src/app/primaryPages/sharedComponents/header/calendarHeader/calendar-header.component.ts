import { Component, HostListener, OnInit} from '@angular/core';
import {CalendarDataService} from '../../../../services/dataService/calendarDataService/calendar-data.service';
import {MatDialog} from '@angular/material/dialog';
import {CalendarData, CalendarService} from '../../../../services/calendarService/calendar.service';
import {DataService} from '../../../../services/dataService/data.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['../SCSS/header-style.scss']
})
export class CalendarHeaderComponent implements OnInit {
  dateLabel = '';
  alternativeDateLabel = '';
  selectedView: string = 'month';
  newEventDialogRef;
  headerIsSmall = false;

  constructor(private calendarDataService: CalendarDataService,
              private calendarService: CalendarService,
              private dataService: DataService,
              public dialog: MatDialog) {
    this.selectedView = this.calendarService.getSelectedView();
    this.selectView();
  }

  ngOnInit(): void {
    this.calendarDataService.headerDateLabelObservable.subscribe(newDateStr => {
      this.dateLabel = newDateStr;
    });
    this.calendarDataService.headerAlternativeDateLabelObservable.subscribe(newDateStr => {
      this.alternativeDateLabel = newDateStr;
    });
    this.dataService.shouldMakeHeaderSmallerObservable.subscribe(bool => {
      this.headerIsSmall = bool;
    });
  }

  goToday() {
    this.calendarDataService.goToday();
  }

  selectView() {
    this.calendarService.setView(this.selectedView);
    this.calendarDataService.changeView(this.selectedView);
  }

  createEvent() {
    const dialogRef = this.calendarService.createNewEvent(new Date());
    this.newEventDialogRef = dialogRef;
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
