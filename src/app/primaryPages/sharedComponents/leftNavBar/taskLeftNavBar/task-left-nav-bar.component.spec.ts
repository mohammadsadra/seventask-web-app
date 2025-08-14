import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLeftNavBarComponent } from './task-left-nav-bar.component';

describe('TaskLeftNavBarComponent', () => {
  let component: TaskLeftNavBarComponent;
  let fixture: ComponentFixture<TaskLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
