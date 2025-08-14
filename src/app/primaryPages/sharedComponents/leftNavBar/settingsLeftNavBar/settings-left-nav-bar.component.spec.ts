import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLeftNavBarComponent } from './settings-left-nav-bar.component';

describe('SettingsLeftNavBarComponent', () => {
  let component: SettingsLeftNavBarComponent;
  let fixture: ComponentFixture<SettingsLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
