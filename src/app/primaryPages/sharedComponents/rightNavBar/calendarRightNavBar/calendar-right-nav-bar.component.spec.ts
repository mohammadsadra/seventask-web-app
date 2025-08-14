import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRightNavBarComponent } from './calendar-right-nav-bar.component';

describe('CalendarRightNavBarComponent', () => {
  let component: CalendarRightNavBarComponent;
  let fixture: ComponentFixture<CalendarRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
