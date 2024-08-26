import { TestBed } from '@angular/core/testing';

import { MedataService } from './medata.service';

describe('MedataService', () => {
  let service: MedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
