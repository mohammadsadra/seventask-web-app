import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyChatRightNavBarComponent } from './sticky-chat-right-nav-bar.component';

describe('StickyChatRightNavBarComponent', () => {
  let component: StickyChatRightNavBarComponent;
  let fixture: ComponentFixture<StickyChatRightNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickyChatRightNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyChatRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
