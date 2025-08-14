import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePickerComponent } from './date-time-picker.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CalendarService} from '../../../services/calendarService/calendar.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {EnglishNumberToArabicNumberPipe} from '../../../pipes/english-number-to-arabic-number.pipe';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DateTimePickerComponent', () => {
  let component: DateTimePickerComponent;
  let fixture: ComponentFixture<DateTimePickerComponent>;

  const calendarServiceSpy = jasmine.createSpyObj('CalendarService', ['getDateString']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
        }
      }), HttpClientTestingModule ],
      declarations: [ DateTimePickerComponent, EnglishNumberToArabicNumberPipe ],
      providers: [
        {
          provide: CalendarService,
          useValue: calendarServiceSpy
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  beforeEach(() => {
    calendarServiceSpy.getDateString.and.returnValue(Promise.resolve('Any String'));
    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show presets', () => {
    component.havePresets = true;
    fixture.detectChanges();

    const presets = fixture.nativeElement.querySelector('.presets-section');
    expect(presets).toBeTruthy();
    expect(presets).toBeLessThanOrEqual(100);
  });
});
