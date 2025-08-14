import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLeftNavBarComponent } from './calendar-left-nav-bar.component';

describe('CalendarLeftNavBarComponent', () => {
  let component: CalendarLeftNavBarComponent;
  let fixture: ComponentFixture<CalendarLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
