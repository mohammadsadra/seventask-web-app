import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRightNavBarComponent } from './chat-right-nav-bar.component';
import {ChatService} from '../../../../services/chatService/chat.service';
import {ChatDataService} from '../../../../services/dataService/chatDataService/chat-data.service';
import {HttpClientModule} from '@angular/common/http';

describe('ChatRightNavBarComponent', () => {
  let component: ChatRightNavBarComponent;
  let fixture: ComponentFixture<ChatRightNavBarComponent>;

  const chatServiceSpy = jasmine.createSpyObj('ChatService', ['']);
  const chatDataServiceSpy = jasmine.createSpyObj('ChatDataService', ['']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      declarations: [ ChatRightNavBarComponent ],
      providers: [
        {
          provide: ChatService,
          useValue: chatServiceSpy
        },
        {
          provide: ChatDataService,
          useValue: chatDataServiceSpy
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRightNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
