import { TestBed } from '@angular/core/testing';

import { UserInfomationService } from './user-infomation.service';

describe('UserInfomationService', () => {
  let service: UserInfomationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfomationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
