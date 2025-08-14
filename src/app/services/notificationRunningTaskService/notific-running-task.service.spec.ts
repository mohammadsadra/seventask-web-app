import { TestBed } from '@angular/core/testing';

import { NotificRunningTaskService } from './notific-running-task.service';

describe('NotificRunningTaskService', () => {
  let service: NotificRunningTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificRunningTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
