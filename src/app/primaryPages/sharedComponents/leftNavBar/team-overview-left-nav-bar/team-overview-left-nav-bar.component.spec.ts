import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOverviewLeftNavBarComponent } from './team-overview-left-nav-bar.component';

describe('TeamOverviewLeftNavBarComponent', () => {
  let component: TeamOverviewLeftNavBarComponent;
  let fixture: ComponentFixture<TeamOverviewLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamOverviewLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOverviewLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
