import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetrackHeaderComponent } from './timetrack-header.component';

describe('TimetrackHeaderComponent', () => {
  let component: TimetrackHeaderComponent;
  let fixture: ComponentFixture<TimetrackHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetrackHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetrackHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
