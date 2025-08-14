import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileComponent } from './upload-file.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FileService} from './fileService/file.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  const postFileSpy = jasmine.createSpy('postFile');
  const formatBytesSpy = jasmine.createSpy('formatBytes');
  const getSpy = jasmine.createSpy('get');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatSnackBarModule ],
      declarations: [ UploadFileComponent ],
      providers: [
        {
          provide: FileService,
          useClass: class  {
            postFile = postFileSpy;
            formatBytes = formatBytesSpy;
          }
        },
        {
          provide: TranslateService,
          useClass: class  {
            get = getSpy;
          }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
