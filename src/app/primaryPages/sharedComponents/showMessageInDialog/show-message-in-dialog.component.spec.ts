import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMessageInDialogComponent } from './show-message-in-dialog.component';

describe('ShowMessageInDialogComponent', () => {
  let component: ShowMessageInDialogComponent;
  let fixture: ComponentFixture<ShowMessageInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMessageInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMessageInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
