import { TestBed } from '@angular/core/testing';

import { PaymanageService } from './paymanage.service';

describe('PaymanageService', () => {
  let service: PaymanageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymanageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
