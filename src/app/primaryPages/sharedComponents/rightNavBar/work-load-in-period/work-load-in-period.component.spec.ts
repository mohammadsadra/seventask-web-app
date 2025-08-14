import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLoadInPeriodComponent } from './work-load-in-period.component';

describe('WorkLoadInPeriodComponent', () => {
  let component: WorkLoadInPeriodComponent;
  let fixture: ComponentFixture<WorkLoadInPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkLoadInPeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkLoadInPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
