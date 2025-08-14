import {inject, TestBed} from '@angular/core/testing';

import {CalendarService} from './calendar.service';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';

describe('CalendarService', () => {
  let service: CalendarService;
  const translateService = jasmine.createSpyObj('TranslateService', ['ijij']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      providers: [
        {
          provide: TranslateService,
          useValue: translateService
        }
      ]
    });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
