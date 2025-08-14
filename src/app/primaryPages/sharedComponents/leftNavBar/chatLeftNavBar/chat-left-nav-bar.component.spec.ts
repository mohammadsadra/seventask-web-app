import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLeftNavBarComponent } from './chat-left-nav-bar.component';

describe('ChatLeftNavBarComponent', () => {
  let component: ChatLeftNavBarComponent;
  let fixture: ComponentFixture<ChatLeftNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatLeftNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatLeftNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
