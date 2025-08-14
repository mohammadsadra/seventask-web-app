import { TestBed } from '@angular/core/testing';

import { InviteLinkHandlerService } from './invite-link-handler.service';

describe('InviteLinkHandlerService', () => {
  let service: InviteLinkHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteLinkHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
