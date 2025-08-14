import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnigtaskNotificationRightNavBarComponent } from './runnigtask-notification-right-nav-bar.component';

describe('RunnigtaskNotificationRightNavBarComponent', () => {
  let component: RunnigtaskNotificationRightNavBarComponent;
  let fixture: ComponentFixture<RunnigtaskNotificationRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunnigtaskNotificationRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnigtaskNotificationRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
