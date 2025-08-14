import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommnetsTaskComponent } from './commnets-task.component';

describe('CommnetsTaskComponent', () => {
  let component: CommnetsTaskComponent;
  let fixture: ComponentFixture<CommnetsTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommnetsTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommnetsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
