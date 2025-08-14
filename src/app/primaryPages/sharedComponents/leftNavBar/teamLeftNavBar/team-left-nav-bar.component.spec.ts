import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeftNavBarComponent } from './team-left-nav-bar.component';

describe('TeamLeftNavBarComponent', () => {
  let component: TeamLeftNavBarComponent;
  let fixture: ComponentFixture<TeamLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
