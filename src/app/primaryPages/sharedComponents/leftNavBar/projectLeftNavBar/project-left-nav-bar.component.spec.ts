import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLeftNavBarComponent } from './project-left-nav-bar.component';

describe('ProjectLeftNavBarComponent', () => {
  let component: ProjectLeftNavBarComponent;
  let fixture: ComponentFixture<ProjectLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
