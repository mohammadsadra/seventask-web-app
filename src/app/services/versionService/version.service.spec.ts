import {fakeAsync, TestBed} from '@angular/core/testing';

import { VersionService } from './version.service';
import {HttpClient} from '@angular/common/http';

describe('VersionService', () => {
  let service: VersionService;
  const httpGetSpy = jasmine.createSpyObj('HttpClient', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: HttpClient, useValue: httpGetSpy } ]
    }).compileComponents();
    service = TestBed.inject(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should equal 2', fakeAsync(() => {
    httpGetSpy.get.and.returnValue(2);
    const version = service.getLastVersion();
    version.toPromise().then(v => {
      expect(v).toEqual(2);
    });
  }));
});
