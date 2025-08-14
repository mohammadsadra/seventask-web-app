import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRightNavBarComponent } from './task-right-nav-bar.component';

describe('TaskRightNavBarComponent', () => {
  let component: TaskRightNavBarComponent;
  let fixture: ComponentFixture<TaskRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
