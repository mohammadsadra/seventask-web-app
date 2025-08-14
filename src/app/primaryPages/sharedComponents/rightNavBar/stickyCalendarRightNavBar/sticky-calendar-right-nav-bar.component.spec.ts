import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyCalendarRightNavBarComponent } from './sticky-calendar-right-nav-bar.component';

describe('StickyCalendarRightNavBarComponent', () => {
  let component: StickyCalendarRightNavBarComponent;
  let fixture: ComponentFixture<StickyCalendarRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickyCalendarRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyCalendarRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
