import { TestBed } from '@angular/core/testing';

import { NotificationChatService } from './notification-chat.service';

describe('NotificationChatService', () => {
  let service: NotificationChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
