import { TestBed } from '@angular/core/testing';

import { NotificService } from './notific.service';

describe('NotificService', () => {
  let service: NotificService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
