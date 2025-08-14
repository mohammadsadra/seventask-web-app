import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeTeamComponent } from './project-change-team.component';

describe('ProjectChangeTeamComponent', () => {
  let component: ProjectChangeTeamComponent;
  let fixture: ComponentFixture<ProjectChangeTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
