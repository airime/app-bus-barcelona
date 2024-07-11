import { TestBed } from '@angular/core/testing';

import { TmbService } from './tmb.service';

describe('TmbService', () => {
  let service: TmbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
