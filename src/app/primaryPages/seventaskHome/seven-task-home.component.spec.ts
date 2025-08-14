import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenTaskHomeComponent } from './seven-task-home.component';

describe('SevenTaskHomeComponent', () => {
  let component: SevenTaskHomeComponent;
  let fixture: ComponentFixture<SevenTaskHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevenTaskHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenTaskHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
