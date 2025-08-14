import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewLeftNavBarComponent } from './project-overview-left-nav-bar.component';

describe('ProjectOverviewLeftNavBarComponent', () => {
  let component: ProjectOverviewLeftNavBarComponent;
  let fixture: ComponentFixture<ProjectOverviewLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectOverviewLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverviewLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
