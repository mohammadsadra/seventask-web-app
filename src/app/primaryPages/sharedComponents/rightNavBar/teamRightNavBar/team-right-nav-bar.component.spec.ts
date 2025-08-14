import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRightNavBarComponent } from './team-right-nav-bar.component';

describe('TeamRightNavBarComponent', () => {
  let component: TeamRightNavBarComponent;
  let fixture: ComponentFixture<TeamRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
