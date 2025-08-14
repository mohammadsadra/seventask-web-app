import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeventaskSpinnerComponent } from './seventask-spinner.component';

describe('SeventaskSpinnerComponent', () => {
  let component: SeventaskSpinnerComponent;
  let fixture: ComponentFixture<SeventaskSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeventaskSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeventaskSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
