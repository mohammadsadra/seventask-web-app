import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRightNavBarComponent } from './project-right-nav-bar.component';

describe('ProjectRightNavBarComponent', () => {
  let component: ProjectRightNavBarComponent;
  let fixture: ComponentFixture<ProjectRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
