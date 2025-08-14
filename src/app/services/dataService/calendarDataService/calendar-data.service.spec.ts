import { TestBed } from '@angular/core/testing';

import { CalendarDataService } from './calendar-data.service';

describe('CalendarDataServiceService', () => {
  let service: CalendarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
