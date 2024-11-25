import { TestBed } from '@angular/core/testing';

import { NotisBordService } from './notis-bord.service';

describe('NotisBordService', () => {
  let service: NotisBordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotisBordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
