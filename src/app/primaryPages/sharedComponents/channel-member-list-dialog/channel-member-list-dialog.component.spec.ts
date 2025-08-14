import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMemberListDialogComponent } from './channel-member-list-dialog.component';

describe('ChannelMemberListDialogComponent', () => {
  let component: ChannelMemberListDialogComponent;
  let fixture: ComponentFixture<ChannelMemberListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMemberListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMemberListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
