import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRightNavBarComponent } from './notification-right-nav-bar.component';

describe('NotificationRightNavBarComponent', () => {
  let component: NotificationRightNavBarComponent;
  let fixture: ComponentFixture<NotificationRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
