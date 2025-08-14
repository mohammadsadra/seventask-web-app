import { TestBed } from '@angular/core/testing';

import { TimeTrackService } from './time-track.service';

describe('TimeTrackService', () => {
  let service: TimeTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
