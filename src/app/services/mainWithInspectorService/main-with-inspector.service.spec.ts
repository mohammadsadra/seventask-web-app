import { TestBed } from '@angular/core/testing';

import { MainWithInspectorService } from './main-with-inspector.service';

describe('MainWithInspectorService', () => {
  let service: MainWithInspectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainWithInspectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
